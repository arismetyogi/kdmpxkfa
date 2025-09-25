<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\Auth\SsoService;
use App\Traits\HasApiReponse;
use Illuminate\Http\JsonResponse;

class SsoController extends Controller
{
    use HasApiReponse;

    public function __construct(
        private readonly SsoService $ssoService
    ) {}

    /**
     * Decrypt an SSO field value
     */
    public function decrypt(SsoService $crypto): JsonResponse
    {
        try {
            $encryptedValue = request('value');

            if (empty($encryptedValue)) {
                return $this->errorResponse('Missing encrypted value', 400);
            }

            $decrypted = $crypto->decryptSsoField($encryptedValue);

            if ($decrypted === null) {
                return $this->errorResponse('Failed to decrypt value', 400);
            }

            return $this->successResponse([
                'decrypted' => $decrypted,
            ], 'Value decrypted successfully');

        } catch (\Exception $e) {
            return $this->errorResponse('Decryption failed: '.$e->getMessage(), 500);
        }
    }
}
