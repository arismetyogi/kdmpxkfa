<?php

namespace App\Services\Auth;

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Str;

readonly class SsoService
{
    //    public function __construct(
    //        private JWTService $jwtService
    //    )
    //    {
    //    }

    /**
     * Handle SSO callback and authenticate user
     *
     * @throws \Throwable
     */
    public function handleCallback(array $data): array
    {
        return DB::transaction(function () use ($data) {
            $userData = $this->validateSSOTokenWithDigikoperasi($data['sso_token'], $data['state'] ?? null);

            Log::debug('Callback validate token: ', $userData);

            // Find or create user
            $user = $this->findOrCreateUser($userData);

            Log::debug('Callback user: ', $user->toArray());

            // Create SSO session
            $this->createSSOSession($user, $data, $userData);

            //            $tokenPayload = [
            //                'user_id' => $user->id,
            //                'email' => $user->email,
            //                'external_id' => $user->external_id,
            //            ];

            //            $accessToken = $this->jwtService->generateToken($tokenPayload);
            //            $refreshToken = $this->jwtService->generateRefreshToken($tokenPayload);

            $result = [
                //                'access_token' => $accessToken,
                //                'refresh_token' => $refreshToken,
                //                'token_type' => 'Bearer',
                //                'expires_in' => config('jwt.ttl', 3600),
                'user' => $user,
                'requires_onboarding' => ! $user->onboarding_completed,
            ];

            // Add prefilled data for onboarding if needed
            if (! $user->onboarding_completed) {
                $result['prefilled_data'] = $this->getPrefilledData($userData);
            }

            return $result;
        });
    }

    /**
     * Validate SSO token with Digikoperasi backend
     *
     * @throws \Exception
     */
    private function validateSSOTokenWithDigikoperasi(string $token, ?string $state): array
    {
        $payload = [
            'sso_token' => $token,
            'state' => $state,
        ];

        try {
            $url = rtrim(config('sso.allowed_origins.digikoperasi.url'), '/').'/redirect-sso/validate';

            $client = Http::withHeaders([
                'Content-Type' => 'application/json',
                'x-api-key' => config('sso.allowed_origins.digikoperasi.api_key'),
            ])
                ->withBody(json_encode($payload), 'application/json');
            $response = $client->post($url);

            Log::debug('SSO URL: ', ['url' => $url]);
            Log::debug('SSO head: ', $client->getOptions());
            Log::debug('SSO Validate Request Body: ', $payload);

            Log::debug('SSO Validate Response: ', [
                'status' => $response->status(),
                'body' => $response->body(),
            ]);

            $responseData = $response->json();
            Log::debug('Response data parsed: ', ['data' => $responseData['data']]);

            if (! $response->ok() || ! isset($responseData['data'])) {
                throw new \Exception('Invalid response from SSO server: '.$response->body());
            }

            return $responseData['data'];

        } catch (\Exception $e) {
            Log::error('SSO validation failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            throw new \Exception('SSO validation failed: '.$e->getMessage());
        }
    }

    //    private function validateSSOTokenWithDigikoperasi(string $token, ?string $state): array
    //    {
    //        $payload = ['sso_token' => $token, 'state' => $state,];
    //        $base = rtrim(config('sso.allowed_origins.digikoperasi.url', ''), '/');
    //        $url = $base . '/redirect-sso/validate';
    //        // Log initial details
    //        Log::debug('SSO validate target', ['url' => $url, 'payload' => $payload]);
    //        // optional: file to store Guzzle raw debug (createable by web server)
    //        $debugFile = storage_path('logs/sso_http_debug.log');
    //        try {
    //            $client = Http::withHeaders([
    //                'Content-Type' => 'application/json',
    //                'x-api-key' => config('sso.allowed_origins.digikoperasi.api_key')
    //            ])->withOptions([
    //                // Guzzle debug to file so you can inspect raw request and response
    //                'debug' => fopen($debugFile, 'a')]);
    //            // Try sending as JSON (most likely) Log::debug('Attempting POST as JSON');
    //            $response = $client->post($url, $payload);
    //            // Laravel sends JSON when array provided
    //            Log::debug('Response status', ['status' => $response->status()]);
    //            Log::debug('Response headers', ['headers' => $response->headers()]);
    //            Log::debug('Response body', ['body' => $response->body()]);
    //            // If server says method not allowed (405) try alternate content type
    //            if ($response->status() === 405) {
    //                Log::warning('Got 405, retrying as x-www-form-urlencoded (asForm)');
    //                $response = Http::withHeaders(['x-api-key' => config('sso.allowed_origins.digikoperasi.api_key'), 'Accept' => 'application/json',])->asForm()->withOptions(['debug' => fopen($debugFile, 'a')])->post($url, $payload);
    //                Log::debug('Retry Response status', ['status' => $response->status()]);
    //                Log::debug('Retry Response headers', ['headers' => $response->headers()]);
    //                Log::debug('Retry Response body', ['body' => $response->body()]);
    //            }
    //            if (!$response->successful()) {
    //                // include response status, headers and body in exception to help debug
    //                $msg = sprintf("Token validation failed with Digikoperasi: status=%s, body=%s, headers=%s",
    //                    $response->status(), $response->body(), json_encode($response->headers()));
    //                throw new \Exception($msg);
    //            }
    //            $responseData = $response->json();
    //            if (!isset($responseData['success']) || !$responseData['success']) {
    //                throw new \Exception('Invalid SSO token: ' . ($responseData['message'] ?? json_encode($responseData)));
    //            }
    //            return $responseData['data'] ?? [];
    //        } catch (\Exception $e) {
    //            // capture debug file location in the message so you can inspect raw HTTP exchange
    //            throw new \Exception('SSO validation failed: ' . $e->getMessage() . ' (see ' . $debugFile . ' for raw request/response)');
    //        }
    //    }

    /**
     * Validate JWT signature (fallback method)
     *
     * @throws \Exception
     */
    //    private function validateJWTToken(string $token): array
    //    {
    //        try {
    //            $decoded = $this->jwtService->validateToken($token);
    //            return $decoded['data'] ?? $decoded;
    //
    //        } catch (\Exception $e) {
    //            throw new \Exception('Invalid JWT token: ' . $e->getMessage());
    //        }
    //    }

    /**
     * Find existing user or create new one
     */
    private function findOrCreateUser(array $userData): User
    {
        $user = User::where('external_id', $userData['sub'])->first();

        if (! $user) {
            $user = User::where('email', $userData['email'])->first();
        }

        if (! $user) {
            $user = User::create([
                'uuid' => Str::uuid(),
                'name' => $userData['name'],
                'username' => Str::before($userData['email'], '@'),
                'email' => $userData['email'],
                'email_verified_at' => now(),
                'onboarding_completed' => false,
                'external_id' => $userData['sub'],
                'is_active' => true,
            ]);
            $user->assignRole('user');
        }

        return $user;
    }

    /**
     * Create SSO session record
     */
    private function createSSOSession(User $user, array $callbackData, array $userData): void
    {
        // Regenerate session ID for security (avoid session fixation)
        Auth::login($user);
        Session::regenerate(true);

        // Store metadata in the Laravel session
        Session::put('sso', [
            'user_id' => $user->id,
            'origin_app' => 'https://koperasi.berasumkm.id/',
            'expires_at' => now()->addSeconds(config('sso.session_expiry')),
            'metadata' => json_encode([
                'callback_data' => $callbackData,
                'user_data' => $userData,
                'ip_address' => request()->ip(),
                'user_agent' => request()->userAgent(),
            ]),
        ]);
    }

    /**
     * Get prefilled data for onboarding
     */
    private function getPrefilledData(array $userData): array
    {
        return [
            'email' => $userData['email'] ?? null,
            'name' => $userData['name'] ?? null,
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
            'timestamp' => now()->timestamp,
        ]);

        return $baseUrl.'/sso/callback?'.$params;
    }
}
