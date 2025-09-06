<?php

namespace App\Services;

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
     * @param  string  $tenantId  User's tenant ID
     * @param  float  $orderAmount  Total order amount to validate
     * @return array ['valid' => bool, 'message' => string, 'remaining_credit' => float|null]
     */
    public function validateCreditLimit(string $tenantId, float $orderAmount): array
    {
        $url = $this->baseUrl.'/remaining-credit/'.$tenantId;
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
            if (! isset($data['data']['remaining_credit'])) {
                Log::error('Invalid credit limit response structure', ['response' => $data]);

                return [
                    'valid' => false,
                    'message' => 'Invalid credit limit response from external service.',
                    'remaining_credit' => null,
                ];
            }

            $availableCredit = (float) $data['data']['remaining_credit'];

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
                    'message' => 'Insufficient credit limit. Available credit: Rp'.number_format($availableCredit, 0, ',', '.').
                                ', Order amount: Rp'.number_format($orderAmount, 0, ',', '.'),
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
}
