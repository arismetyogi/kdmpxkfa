<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\Auth\SsoService;
use App\Traits\HasApiReponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class SsoController extends Controller
{
    use HasApiReponse;

    public function __construct(
        private readonly SSOService $ssoService
    ) {}

    /**
     * Handle SSO callback from Digikoperasi
     */
    public function callback(Request $request): RedirectResponse
    {
        try {
            $ssoToken = $request->query('sso_token');
            $state = $request->query('state');

            if (!$ssoToken) {
                return redirect('/login?error=sso_failed&message=missing_token');
            }

            if (!$state) {
                return redirect('/login?error=sso_failed&message=missing_state');
            }

            $result = $this->ssoService->handleCallback([
                'sso_token' => $ssoToken,
                'state' => $state
            ]);

            $sessionCookie = cookie(
                'auth_session',
                $result['token'],
                config('sso.token_expiry') / 60, // Convert seconds to minutes
                '/',
                null,
                true, // secure
                true  // httpOnly
            );

            if ($result['requires_onboarding']) {
                return redirect('/onboarding')
                    ->withCookie($sessionCookie)
                    ->with('user_data', $result['user'])
                    ->with('prefilled_data', $result['prefilled_data']);
            }

            $targetUrl = $request->query('redirect_to', '/dashboard');
            return redirect($targetUrl)
                ->withCookie($sessionCookie)
                ->with('user_data', $result['user']);

        } catch (\Exception $e) {
            return redirect('/login?error=sso_failed&message=' . urlencode($e->getMessage()));
        } catch (\Throwable $e) {
            return redirect('/login?error=sso_failed&message=' . urlencode($e->getMessage()));
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
