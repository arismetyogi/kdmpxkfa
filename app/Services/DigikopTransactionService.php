<?php

namespace App\Services;

use App\Models\Order;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class DigikopTransactionService
{
    private string $baseUrl;

    public function __construct(private readonly DigikopAuthService $authService)
    {
        $this->baseUrl = rtrim(config('transaction.digikoperasi.base_url'), '/');
    }

    /**
     * Validate user's credit limit against external API
     *
     * @param string $tenantId User's tenant ID
     * @param float $orderAmount Total order amount to validate
     * @return array ['valid' => bool, 'message' => string, 'remaining_credit' => float|null]
     */
    public function validateCreditLimit(string $tenantId, float $orderAmount): array
    {
        $url = $this->baseUrl . '/remaining-credit/' . $tenantId;
        try {
            $token = $this->authService->getAccessToken();
            // Make API call to external service to get credit limit
            $response = Http::withToken($token)->timeout(30)->get($url);

            if ($response->unauthorized()) {
                // Token expired, refresh and retry once
                $this->authService->refreshToken();
                $token = $this->authService->getAccessToken();
                $response = Http::withToken($token)->timeout(30)->get($url);
            }

            if ($response->failed()) {
                Log::error('Credit limit API call failed', [
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]);

                return [
                    'valid' => false,
                    'message' => 'Unable to verify credit limit at this time. Please try again later.',
                    'remaining_credit' => null,
                ];
            }

            $data = $response->json();
            Log::debug('Data response: ', $data);

            // Check if the response has the expected structure
            if (!isset($data['data']['remaining_credit'])) {
                Log::error('Invalid credit limit response structure', ['response' => $data]);

                return [
                    'valid' => false,
                    'message' => 'Invalid credit limit response from external service.',
                    'remaining_credit' => null,
                ];
            }

            $availableCredit = (float)$data['data']['remaining_credit'];

            // Check if available credit is sufficient
            if ($availableCredit >= $orderAmount) {
                return [
                    'valid' => true,
                    'message' => 'Credit limit validation successful.',
                    'remaining_credit' => $availableCredit,
                ];
            } else {
                return [
                    'valid' => false,
                    'message' => 'Insufficient credit limit. Available credit: Rp' . number_format($availableCredit, 0, ',', '.') .
                        ', Order amount: Rp' . number_format($orderAmount, 0, ',', '.'),
                    'remaining_credit' => $availableCredit,
                ];
            }
        } catch (\Exception $e) {
            Log::error('Credit limit validation error', [
                'exception' => $e->getMessage(),
                'tenant_id' => $tenantId,
                'order_amount' => $orderAmount,
            ]);

            return [
                'valid' => false,
                'message' => 'An error occurred while validating credit limit. Please try again later.',
                'remaining_credit' => null,
            ];
        }
    }

    /**
     * Send transaction data to Digikoperasi
     *
     * @param array $transactionData
     * @return array ['success' => bool, 'message' => string, 'data' => array|null]
     */
    public function sendTransaction(array $transactionData): array
    {
        $url = $this->baseUrl . '/transactions';

        Log::info('Transaction data received: ', $transactionData);

        // Validate credit limit before sending transaction
        if (!isset($transactionData['tenant_id']) || !isset($transactionData['total_amount'])) {
            Log::error('Missing required data for credit limit validation', [
                'transaction_data' => $transactionData
            ]);

            return [
                'success' => false,
                'message' => 'Missing required data for transaction processing.',
                'data' => null,
            ];
        }

        $creditValidation = $this->validateCreditLimit(
            $transactionData['tenant_id'],
            $transactionData['total_amount']
        );

        // If credit validation fails, return the error
        if (!$creditValidation['valid']) {
            Log::warning('Credit limit validation failed', $creditValidation);
            return [
                'success' => false,
                'message' => $creditValidation['message'],
                'data' => null,
            ];
        }

        try {
            $token = $this->authService->getAccessToken();

            // Make API call to send transaction data
            $response = Http::withToken($token)
                ->timeout(30)
                ->post($url, $transactionData);

            if ($response->unauthorized()) {
                Log::info('Transaction data send failed', [$response->json()]);
                // Token expired, refresh and retry once
                $this->authService->refreshToken();
                $token = $this->authService->getAccessToken();
                $response = Http::withToken($token)
                    ->timeout(30)
                    ->post($url, $transactionData);
            }

            if ($response->failed()) {
                Log::error('Transaction API call failed', [
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]);

                return [
                    'success' => false,
                    'message' => 'Failed to send transaction data. Please try again later.',
                    'data' => null,
                ];
            }

            $data = $response->json();

            Log::info("Response Data: ", $data);

            // Check if the response indicates success
            if (isset($data['status']) && $data['status'] === 'success') {
                // update status to dalam-pengiriman karena data dikirim ke digikop setelah diproses oleh apotek, bukan saat order dibuat
                $payload = [
                    "id_transaksi" => $transactionData['id_transaksi'],
                    "status" => 'dalam-pengiriman'
                ];
                Log::info("Update Data: ", $payload);
                $response = Http::withToken($token)
                    ->timeout(30)
                    ->put($url, $payload);

                Log::info("Response for Update Data: ", $response->json());

                return [
                    'success' => true,
                    'message' => 'Transaction sent successfully.',
                    'data' => $data,
                ];
            } else {
                Log::error('Transaction API returned error', ['response' => $data]);

                $message = 'Failed to send transaction data.';
                if (isset($data['message'])) {
                    $message = $data['message'];
                } elseif (isset($data['error'])) {
                    $message = $data['error'];
                }

                return [
                    'success' => false,
                    'message' => $message,
                    'data' => $data,
                ];
            }
        } catch (\Exception $e) {
            Log::error('Transaction sending error', [
                'exception' => $e->getMessage(),
                'transaction_data' => $transactionData,
            ]);

            return [
                'success' => false,
                'message' => 'An error occurred while sending transaction data. Please try again later.',
                'data' => null,
            ];
        }
    }

    public function updateTransactionStatus(Order $order, string $status): array
    {
        $url = $this->baseUrl . '/transactions';
        $payload = [
            "id_transaksi" => $order['id_transaksi'],
            "status" => $status
        ];

        try {
            $token = $this->authService->getAccessToken();

            // Make API call to send transaction data
            $response = Http::withToken($token)
                ->timeout(30)
                ->put($url, $payload);

            if ($response->unauthorized()) {
                Log::info('Transaction status update failed', [$response->json()]);
                // Token expired, refresh and retry once
                $this->authService->refreshToken();
                $token = $this->authService->getAccessToken();
                $response = Http::withToken($token)
                    ->timeout(30)
                    ->put($url, $payload);
            }

            if ($response->failed()) {
                Log::error('Transaction update API call failed', [
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]);

                return [
                    'success' => false,
                    'message' => 'Failed to update transaction status. Please try again later.',
                    'data' => null,
                ];
            }

            $data = $response->json();

            if (isset($data['status']) && $data['status'] === 'success') {
                return [
                    'success' => true,
                    'message' => 'Transaction status updated successfully.',
                    'data' => $data,
                ];
            } else {
                return [
                    'success' => false,
                    'message' => 'Failed to update transaction status. Please try again later.',
                    'data' => null,
                ];
            }
        } catch (ConnectionException $e) {
            Log::error('Transaction status update error', [
                'exception' => $e->getMessage(),
                'payload' => $payload,
            ]);

            return [
                'success' => false,
                'message' => 'An error occurred while updating transaction status. Please try again later.',
                'data' => null,
            ];
        }
    }
}
