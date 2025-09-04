<?php

namespace App\Services;

use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use mysql_xdevapi\Exception;

class TransactionService
{
    private string $baseUrl;

    public function __construct()
    {
        $this->baseUrl = rtrim(config('transaction.digikoperasi_transactions.base_url'), '/');
    }

    /**
     * @throws \Exception
     */
    public function login(string $accessKey, string $accessSecret): array
    {
        $url = $this->baseUrl . '/koperasi-auth/login';

        $payload = [
            'access_key' => $accessKey,
            'access_secret' => $accessSecret,
        ];
        try {
            $response = Http::withBody(json_encode($payload))->post($url);

            Log::debug('Login Response: ', [
                'status' => $response->status(),
                'body' => $response->body(),
            ]);

            $responseData = $response->json();

            if (! $response->ok() || ! isset($responseData['data'])) {
                throw new \Exception('Invalid response from server: ' . $response->body());
            }
            return $responseData['data'];
        } catch (ConnectionException $e) {
            Log::error($e->getMessage());
            throw new \Exception('Connection failed: ' . $e->getMessage());
        }
    }
    /**
     * Validate user's credit limit against external API
     *
     * @param string $tenantId User's tenant ID
     * @param float $orderAmount Total order amount to validate
     * @return array ['valid' => bool, 'message' => string, 'available_credit' => float|null]
     */
    public function validateCreditLimit(string $tenantId, float $orderAmount): array
    {
        $url = $this->baseUrl . '/remaining-credit/' . $tenantId;
        try {
            // Make API call to external service to get credit limit
            $response = Http::timeout(30)->post($url);

            if ($response->failed()) {
                Log::error('Credit limit API call failed', [
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]);

                return [
                    'valid' => false,
                    'message' => 'Unable to verify credit limit at this time. Please try again later.',
                    'available_credit' => null,
                ];
            }

            $data = $response->json();

            // Check if the response has the expected structure
            if (!isset($data['available_credit']) || !is_numeric($data['available_credit'])) {
                Log::error('Invalid credit limit response structure', ['response' => $data]);

                return [
                    'valid' => false,
                    'message' => 'Invalid credit limit response from external service.',
                    'available_credit' => null,
                ];
            }

            $availableCredit = (float) $data['available_credit'];

            // Check if available credit is sufficient
            if ($availableCredit >= $orderAmount) {
                return [
                    'valid' => true,
                    'message' => 'Credit limit validation successful.',
                    'available_credit' => $availableCredit,
                ];
            } else {
                return [
                    'valid' => false,
                    'message' => 'Insufficient credit limit. Available credit: Rp' . number_format($availableCredit, 0, ',', '.') .
                                ', Order amount: Rp' . number_format($orderAmount, 0, ',', '.'),
                    'available_credit' => $availableCredit,
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
                'available_credit' => null,
            ];
        }
    }
}
