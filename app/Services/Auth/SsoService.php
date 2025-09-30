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
    private string $stateSecret;

    public function __construct()
    {
        $this->stateSecret = config('sso.allowed_origins.digikoperasi.state_secret');
    }

    /**
     * Handle SSO callback and authenticate user
     *
     * @throws \Throwable
     */
    public function handleCallback(array $data): array
    {
        return DB::transaction(function () use ($data) {
            $userData = $this->validateSSOTokenWithDigikoperasi($data['sso_token'], $data['state'] ?? null);

            //            Log::debug('Callback validate data: ', $userData);

            // Find or create user
            $user = $this->findOrCreateUser($userData);

            // Create SSO session
            $this->createSSOSession($user, $data, $userData);

            $result = [
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
    public function validateSSOTokenWithDigikoperasi(string $token, ?string $state): array
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
                // 'Origin' => request()->getSchemeAndHttpHost(), // or config('app.url')
            ])
                ->withBody(json_encode($payload), 'application/json');
            $response = $client->post($url);

            $responseData = $response->json();

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

    /**
     * Find existing user or create new one
     *
     * @throws \Exception
     */
    private function findOrCreateUser(array $userData): User
    {
        $user = User::where('external_id', $userData['sub'])->first();
        $email = $this->decryptSsoField($userData['email']) ?? null;
        //        Log::info('Decrypted SSO user: ' . $email);

        if (! $user) {
            $user = User::where('email', $email)->first();
        }

        if (! $user) {
            $user = User::create([
                'uuid' => Str::uuid(),
                'name' => $userData['name'],
                'username' => Str::before($email, '@'),
                'email' => $email,
                'email_verified_at' => now(),
                'onboarding_completed' => false,
                'external_id' => $userData['sub'],
                'tenant_id' => $userData['tenant_id'],
                'tenant_name' => $userData['tenant_name'],
                'phone' => $userData['phone'],
                'is_active' => true,
            ]);
            $user->assignRole('user');
            //            Log::info('User created: ' . $user);

            $this->createUserProfile($user, $userData);
        }

        if (! $user) {
            Log::error('User creation failed');
        }

        return $user;
    }

    /**
     * @throws \Exception
     */
    private function createUserProfile(User $user, array $userData): User
    {
        // Decrypt sensitive fields
        $decryptedNik = $this->decryptSsoField($userData['nik']) ?? '';
        $decryptedPicName = $this->decryptSsoField($userData['pic_name']) ?? '';
        $decryptedPicPhone = $this->decryptSsoField($userData['pic_phone']) ?? '';
        $decryptedNibNumber = $this->decryptSsoField($userData['nib_number']) ?? '';
        $decryptedBankAccount = (array) $this->decryptSsoField($userData['bank_account']) ?? [];
        $decryptedNpwp = $this->decryptSsoField($userData['npwp_number']) ?? '';
        $decryptedSkNumber = $this->decryptSsoField($userData['sk_number']) ?? '';

        // Handle latitude and longitude with proper defaults
        $latitude = isset($userData['latitude']) ? (float) $userData['latitude'] : 0.0;
        $longitude = isset($userData['longitude']) ? (float) $userData['longitude'] : 0.0;

        // Ensure all required string fields have values
        $profileData = [
            'user_id' => $user->id,
            'name' => $userData['name'] ?? '',
            'tenant_id' => $userData['tenant_id'] ?? '',
            'tenant_name' => $userData['tenant_name'] ?? '',
            'source_app' => $userData['source_app'] ?? '',
            'province_code' => (string) $userData['province_code'] ?? '',
            'city_code' => (string) $userData['regency_city_code'] ?? '',
            'district_code' => (string) $userData['district_code'] ?? '',
            'village_code' => (string) $userData['village_code'] ?? '',
            'address' => $userData['registered_address'] ?? '',
            'latitude' => $latitude,
            'longitude' => $longitude,
            'nik' => $decryptedNik,
            'pic_name' => $decryptedPicName,
            'pic_phone' => $decryptedPicPhone,
            'nib_number' => $decryptedNibNumber,
            'bank_account' => $decryptedBankAccount,
            'npwp' => $decryptedNpwp,
            'sk_number' => $decryptedSkNumber,
            'nib_file' => $userData['nib_file'] ?? '',
            'ktp_file' => $userData['ktp_file'] ?? '',
            'npwp_file' => $userData['npwp_file'] ?? '',
        ];

        try {
            $user->userProfile()->updateOrCreate($profileData);

            //            Log::info('Profile created for user: ' . $user->email);
            return $user;
        } catch (\Exception $e) {
            Log::error('Failed to create user profile: '.$e->getMessage(), [
                'user_id' => $user->id,
                'profile_data' => $profileData,
                'trace' => $e->getTraceAsString(),
            ]);
            throw $e;
        }
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
            'email' => $this->decryptSsoField($userData['email']) ?? null,
            'name' => $userData['name'] ?? null,
            'phone' => $userData['phone'] ?? null,
            'tenant_id' => $userData['tenant_id'] ?? null,
            'tenant_name' => $userData['tenant_name'] ?? null,
            'address' => $userData['registered_address'],
            'latitude' => (float) $userData['latitude'] ?? null,
            'longitude' => (float) $userData['longitude'] ?? null,
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

    /**
     * Encrypt an array into base64(ivHex:encrypted) format
     */
    public function encryptSsoField(array $payload): ?string
    {
        try {
            // Prepare plaintext JSON
            $plaintext = json_encode($payload, JSON_UNESCAPED_UNICODE);

            if ($plaintext === false) {
                throw new \Exception('Failed to encode payload');
            }

            // Generate 32-byte key
            $key = hash('sha256', $this->stateSecret, true);

            // Generate random 16-byte IV
            $iv = random_bytes(16);

            // Encrypt
            $encrypted = openssl_encrypt(
                $plaintext,
                'AES-256-CBC',
                $key,
                OPENSSL_RAW_DATA,
                $iv
            );

            if ($encrypted === false) {
                throw new \Exception('Encryption failed');
            }

            $ivHex = bin2hex($iv);

            // Concatenate ivHex:encryptedHex, then base64 encode
            $data = $ivHex.':'.bin2hex($encrypted);

            return base64_encode($data);
        } catch (\Throwable $e) {
            Log::error('Enkripsi field SSO gagal: '.$e->getMessage());

            return null;
        }
    }

    /**
     * Decrypt back to array
     */
    public function decryptSsoField(?string $encryptedValue)
    {
        if (empty($encryptedValue) || empty($this->stateSecret)) {
            return null;
        }

        try {
            $data = base64_decode($encryptedValue, true);

            if ($data === false) {
                throw new \Exception('Base64 decode failed');
            }

            [$ivHex, $encryptedHex] = explode(':', $data, 2);

            if (! $ivHex || ! $encryptedHex) {
                throw new \Exception('Invalid encrypted data format');
            }

            $key = hash('sha256', $this->stateSecret, true);
            $iv = hex2bin($ivHex);
            $encrypted = hex2bin($encryptedHex);

            if ($iv === false || $encrypted === false) {
                throw new \Exception('Invalid hex encoding');
            }

            $decrypted = openssl_decrypt(
                $encrypted,
                'AES-256-CBC',
                $key,
                OPENSSL_RAW_DATA,
                $iv
            );

            if ($decrypted === false) {
                throw new \Exception('Decryption failed');
            }

            return json_decode($decrypted, true);
        } catch (\Throwable $e) {
            Log::error('Dekripsi field SSO gagal: '.$e->getMessage());

            return null;
        }
    }
}
