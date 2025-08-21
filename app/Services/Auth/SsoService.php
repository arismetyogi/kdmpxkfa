<?php

namespace App\Services\Auth;

use App\Models\SsoSession;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class SsoService
{
    public function __construct(
        private JWTService $jwtService
    ) {}

    /**
     * Handle SSO callback and authenticate user
     */
    public function handleCallback(array $data): array
    {
        return DB::transaction(function () use ($data) {
            $userData = $this->validateSSOTokenWithDigikoperasi($data['sso_token'], $data['state'] ?? null);

            // Find or create user
            $user = $this->findOrCreateUser($userData);

            // Create SSO session
            $this->createSSOSession($user, $data, $userData);

            $tokenPayload = [
                'user_id' => $user->id,
                'email' => $user->email,
                'external_id' => $user->external_id,
            ];

            $accessToken = $this->jwtService->generateToken($tokenPayload);
            $refreshToken = $this->jwtService->generateRefreshToken($tokenPayload);

            $result = [
                'access_token' => $accessToken,
                'refresh_token' => $refreshToken,
                'token_type' => 'Bearer',
                'expires_in' => config('jwt.ttl', 3600),
                'user' => $user->load('profile'),
                'requires_onboarding' => !$user->onboarding_completed
            ];

            // Add prefilled data for onboarding if needed
            if (!$user->onboarding_completed) {
                $result['prefilled_data'] = $this->getPrefilledData($userData);
            }

            return $result;
        });
    }

    /**
     * Validate SSO token with Digikoperasi backend
     * @throws \Exception
     */
    private function validateSSOTokenWithDigikoperasi(string $token, ?string $state): array
    {
        try {
            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
                'x-api-key' => config('sso.allowed_origins.digikoperasi.api_key'),
            ])->post(config('sso.allowed_origins.digikoperasi.url') . '/redirect-sso/validate', [
                'sso_token' => $token
            ]);

            if (!$response->successful()) {
                throw new \Exception('Token validation failed with Digikoperasi: ' . $response->body());
            }

            $responseData = $response->json();

            if (!isset($responseData['success']) || !$responseData['success']) {
                throw new \Exception('Invalid SSO token: ' . ($responseData['message'] ?? 'Unknown error'));
            }

            return $responseData['data'];

        } catch (\Exception $e) {
            throw new \Exception('SSO validation failed: ' . $e->getMessage());
        }
    }

    /**
     * Validate JWT signature (fallback method)
     * @throws \Exception
     */
    private function validateJWTToken(string $token): array
    {
        try {
            $decoded = $this->jwtService->validateToken($token);
            return $decoded['data'] ?? $decoded;

        } catch (\Exception $e) {
            throw new \Exception('Invalid JWT token: ' . $e->getMessage());
        }
    }

    /**
     * Find existing user or create new one
     */
    private function findOrCreateUser(array $userData): User
    {
        $user = User::where('external_id', $userData['user_id'])->first();

        if (!$user) {
            $user = User::where('email', $userData['email'])->first();
        }

        if (!$user) {
            $user = User::create([
                'uuid' => Str::uuid(),
                'external_id' => $userData['user_id'],
                'email' => $userData['email'],
                'email_verified_at' => isset($userData['email_verified']) && $userData['email_verified'] ? now() : null,
                'onboarding_completed' => false,
                'status' => 'active'
            ]);
        } else {
            if (!$user->external_id) {
                $user->update(['external_id' => $userData['user_id']]);
            }
        }

        return $user;
    }

    /**
     * Create SSO session record
     */
    private function createSSOSession(User $user, array $callbackData, array $userData): void
    {
        SsoSession::where('user_id', $user->id)
            ->where('origin_app', $callbackData['origin_app'] ?? 'https://koperasi.berasumkm.id/')
            ->where('expires_at', '<', now())
            ->delete();

        SsoSession::create([
            'user_id' => $user->id,
            'session_token' => Str::random(64),
            'origin_app' => $callbackData['origin_app'] ?? 'https://koperasi.berasumkm.id/',
            'expires_at' => now()->addSeconds(config('sso.session_expiry')),
            'metadata' => json_encode([
                'callback_data' => $callbackData,
                'user_data' => $userData,
                'ip_address' => request()->ip(),
                'user_agent' => request()->userAgent()
            ])
        ]);
    }

    /**
     * Get prefilled data for onboarding
     */
    private function getPrefilledData(array $userData): array
    {
        return [
            'email' => $userData['email'] ?? null,
            'first_name' => $userData['first_name'] ?? $userData['name'] ?? null,
            'last_name' => $userData['last_name'] ?? null,
            'phone' => $userData['phone'] ?? null,
            'tenant_id' => $userData['tenant_id'] ?? null,
            'tenant_name' => $userData['tenant_name'] ?? null,
        ];
    }

    /**
     * Build redirect URL back to Digikoperasi on failure
     */
    public function buildFailureRedirectUrl(string $error = 'authentication_failed'): string
    {
        $baseUrl = config('sso.allowed_origins.digikoperasi.url');
        $params = http_build_query([
            'error' => $error,
            'target_app' => config('app.url'),
            'timestamp' => now()->timestamp
        ]);

        return $baseUrl . '/sso/callback?' . $params;
    }
}
