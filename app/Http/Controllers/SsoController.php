<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Services\Auth\SsoService;
use App\Traits\HasApiReponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SsoController extends Controller
{
    use HasApiReponse;

    public function __construct(
        private readonly SsoService $ssoService
    ) {}

    /**
     * Handle SSO callback from Digikoperasi
     */
    public function callback(Request $request): JsonResponse
    {
        try {
            $ssoToken = $request->query('sso_token');
            $state = $request->query('state');

            if (!$ssoToken) {
                throw new \Exception('Missing sso_token parameter');
            }

            if (!$state) {
                throw new \Exception('Missing state parameter');
            }

            $result = $this->ssoService->handleCallback([
                'sso_token' => $ssoToken,
                'state' => $state
            ]);

            if ($result['requires_onboarding']) {
                return $this->successResponse([
                    'access_token' => $result['token'],
                    'token_type' => 'Bearer',
                    'expires_in' => config('sso.token_expiry'),
                    'requires_onboarding' => true,
                    'user' => $result['user'],
                    'prefilled_data' => $result['prefilled_data'],
                    'redirect_url' => config('sso.redirect_urls.onboarding')
                ], 'Authentication successful. Onboarding required.');
            }

            return $this->successResponse([
                'access_token' => $result['token'],
                'token_type' => 'Bearer',
                'expires_in' => config('sso.token_expiry'),
                'user' => $result['user'],
                'redirect_url' => config('sso.redirect_urls.success')
            ], 'Authentication successful.');

        } catch (\Exception $e) {
            return $this->errorResponse('error', 401, [
                'message' => 'Authentication failed: ' . $e->getMessage(),
                'redirect_url' => $this->ssoService->buildFailureRedirectUrl('token_validation_failed'),
                'show_digikoperasi_login' => true
            ]);
        }
    }

    /**
     * Refresh authentication token
     */
    public function refresh(Request $request): JsonResponse
    {
        try {
            $token = auth()->refresh();

            return $this->successResponse([
                'access_token' => $token,
                'token_type' => 'Bearer',
                'expires_in' => config('sso.token_expiry'),
            ], 'Token refreshed successfully.');

        } catch (\Exception $e) {
            return $this->errorResponse('Token refresh failed', 401);
        }
    }

    /**
     * Logout user and invalidate token
     */
    public function logout(): JsonResponse
    {
        try {
            auth()->logout();

            return $this->successResponse([], 'Successfully logged out.');

        } catch (\Exception $e) {
            return $this->errorResponse('Logout failed', 500);
        }
    }

    /**
     * Get authenticated user profile
     */
    public function me(): JsonResponse
    {
        try {
            $user = auth()->user();

            return $this->successResponse([
                'user' => $user->load('profile')
            ]);

        } catch (\Exception $e) {
            return $this->errorResponse('Failed to retrieve user data', 500);
        }
    }
}
