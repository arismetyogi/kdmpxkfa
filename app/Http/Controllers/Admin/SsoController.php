<?php

namespace App\Http\Controllers\Admin;

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
    public function callback(Request $request)
    {
        try {
            $ssoToken = $request->query('sso_token');
            $state = $request->query('state');

            if (! $ssoToken) {
                throw new \Exception('Missing sso_token parameter');
            }

            if (! $state) {
                throw new \Exception('Missing state parameter');
            }

            $result = $this->ssoService->handleCallback([
                'sso_token' => $ssoToken,
                'state' => $state,
            ]);

            if ($result['requires_onboarding']) {
                return redirect(route('onboarding.create'))->with('prefilled_data', $result['prefilled_data']);
            }

            return redirect(route('dashboard'))->withSuccess('Login sukses.');

        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        } catch (\Throwable $e) {
            return back()->with('error', $e->getMessage());
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
                'user' => $user->load('profile'),
            ]);

        } catch (\Exception $e) {
            return $this->errorResponse('Failed to retrieve user data', 500);
        }
    }

    /**
     * Decrypt an SSO field value
     */
    public function decrypt(Request $request)
    {
        try {
            $encryptedValue = $request->input('value');

            if (empty($encryptedValue)) {
                if ($request->wantsJson()) {
                    return $this->errorResponse('Missing encrypted value', 400);
                }

                return back()->with('error', 'Missing encrypted value');
            }

            $decrypted = $this->ssoService->decryptSsoField($encryptedValue);

            if ($decrypted === null) {
                if ($request->wantsJson()) {
                    return $this->errorResponse('Failed to decrypt value', 400);
                }

                return back()->with('error', 'Failed to decrypt value');
            }

            if ($request->wantsJson()) {
                return $this->successResponse([
                    'decrypted' => $decrypted,
                ], 'Value decrypted successfully');
            }

            return redirect()->back()->with('data', ['decrypted' => $decrypted]);

        } catch (\Exception $e) {
            if ($request->wantsJson()) {
                return $this->errorResponse('Decryption failed: '.$e->getMessage(), 500);
            }

            return back()->with('error', 'Decryption failed: '.$e->getMessage());
        }
    }
}
