<?php

namespace App\Services\Auth;

use App\Models\User;
use Exception;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Str;

readonly class SsoService
{
    private string $stateSecret;
    private string $ssoUrl;

    public function __construct()
    {
        $this->stateSecret = config('sso.allowed_origins.digikoperasi.state_secret');
        $this->ssoUrl = rtrim(config('sso.allowed_origins.digikoperasi.url'), '/') . '/redirect-sso/validate';
    }

    /**
     * Handle SSO callback and authenticate user
     *
     * @throws \Throwable
     */
    public function handleCallback(array $data): array
    {
        return DB::transaction(function () use ($data) {
            $signatureSecret = config('sso.allowed_origins.digikoperasi.signature_secret') ?? null;
            $apiKey =config('sso.allowed_origins.digikoperasi.api_key');
//            Log::info('Api key:' . $apiKey);
            // Gunakan validasi signature jika secret tersedia
            if (isset($signatureSecret)) {
//                Log::info("Signature secret is " . $signatureSecret);
                $userData = $this->validateSsoTokenWithSignature($data['ssoToken'], $data['$state'], $signatureSecret, $apiKey);
            } else {
                $userData = $this->validateSSOTokenWithDigikoperasi($data['sso_token'], $data['state'], $apiKey);
            }

            // Log::debug('Callback validate data: ', $userData);

            // Find or create user
            $user = $this->findOrCreateUser($userData);

            // Create SSO session
            $this->createSSOSession($user, $data, $userData);

            $result = [
                'user' => $user,
                'requires_onboarding' => !$user->onboarding_completed,
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
     *
     * @throws \Exception
     */
    private function validateSSOTokenWithDigikoperasi(string $token, ?string $state, string $apiKey): array
    {
        $payload = [
            'sso_token' => $token,
            'state' => $state,
        ];

        try {
            list($response, $responseData) = $this->performApiRequest($apiKey, $payload, $this->ssoUrl);
            Log::info('Response sso: ', [$response, $responseData]);
            if (!$response->ok() || !isset($responseData['data'])) {
                throw new \Exception('Invalid response from SSO server: ' . $response->body());
            }

            return $responseData['data'];

        } catch (\Exception $e) {
            Log::error('SSO validation failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            throw new \Exception('SSO validation failed: ' . $e->getMessage());
        }
    }

    /**
     * Validate SSO token with Digikoperasi backend with signature
     *
     * @throws \Exception
     */
    private function validateSsoTokenWithSignature(string $ssoToken, ?string $state, string $signatureSecret, string $apiKey): array
    {
        Log::info("SSO Token: " . $ssoToken);
        Log::info('validate with sig: ', [$ssoToken, $state, $signatureSecret, $apiKey]);
        $timestamp = now()->timestamp;
        $nonce = $this->generateNonce();
        $signature = $this->generateSignature($signatureSecret, $ssoToken, $state, $timestamp, $nonce);
        $payload = [
            'sso_token' => $ssoToken,
            'state' => $state,
            'signature' => $signature,
            'timestamp' => (string)$timestamp,
            'nonce' => $nonce
        ];
        Log::info('payload: ' . json_encode($payload));
        try {
            list($response, $responseData) = $this->performApiRequest($apiKey, $payload, $this->ssoUrl);
            Log::info('Response sso with sig: ', [$response, $responseData]);
            if (!$response->ok() || !isset($responseData['data'])) {
                Log::error('Invalid response from SSO server: ' . $response->body());
                throw new \Exception('Invalid response from SSO server: ' . $response->body());
            }

            return $responseData['data'];

        } catch (\Exception $e) {
            Log::error('SSO validation with signature failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            throw new \Exception('SSO validation wth signature failed: ' . $e->getMessage());
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

        if (!$user) {
            $user = User::where('email', $email)->first();
        }

        if (!$user) {
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

        if (!$user) {
            Log::error('User creation failed');
        }

        return $user;
    }

    /**
     * @throws \Exception
     */
    private function createUserProfile(User $user, array $userData): void
    {
        // Decrypt sensitive fields
        $decryptedNik = $this->decryptSsoField($userData['nik']) ?? '';
        $decryptedPicName = $this->decryptSsoField($userData['pic_name']) ?? '';
        $decryptedPicPhone = $this->decryptSsoField($userData['pic_phone']) ?? '';
        $decryptedNibNumber = $this->decryptSsoField($userData['nib_number']) ?? '';
        $decryptedBankAccount = (array)$this->decryptSsoField($userData['bank_account']) ?? [];
        $decryptedNpwp = $this->decryptSsoField($userData['npwp_number']) ?? '';
        $decryptedSkNumber = $this->decryptSsoField($userData['sk_number']) ?? '';

        // Handle latitude and longitude with proper defaults
        $latitude = isset($userData['latitude']) ? (float)$userData['latitude'] : 0.0;
        $longitude = isset($userData['longitude']) ? (float)$userData['longitude'] : 0.0;

        // Ensure all required string fields have values
        $profileData = [
            'user_id' => $user->id,
            'name' => $userData['name'] ?? '',
            'tenant_id' => $userData['tenant_id'] ?? '',
            'tenant_name' => $userData['tenant_name'] ?? '',
            'source_app' => $userData['source_app'] ?? '',
            'province_code' => (string)$userData['province_code'] ?? '',
            'city_code' => (string)$userData['regency_city_code'] ?? '',
            'district_code' => (string)$userData['district_code'] ?? '',
            'village_code' => (string)$userData['village_code'] ?? '',
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
            return;
        } catch (\Exception $e) {
            Log::error('Failed to create user profile: ' . $e->getMessage(), [
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
            'latitude' => (float)$userData['latitude'] ?? null,
            'longitude' => (float)$userData['longitude'] ?? null,
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

        return $baseUrl . '/sso/callback?' . $params;
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
            $data = $ivHex . ':' . bin2hex($encrypted);

            return base64_encode($data);
        } catch (\Throwable $e) {
            Log::error('Enkripsi field SSO gagal: ' . $e->getMessage());

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

            if (!$ivHex || !$encryptedHex) {
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
            Log::error('Dekripsi field SSO gagal: ' . $e->getMessage());

            return null;
        }
    }

    /**
     * generate SSO Signature
     * @throws Exception
     */
    private function generateSignature(string $signatureSecret, string $ssoToken, string $state, string $timestamp, string $nonce): string
    {
        if (empty($signatureSecret) || empty($ssoToken) ||
            empty($state) ||
            empty($timestamp) || empty($nonce)) {
            Log::error('Parameter tidak lengkap untuk generate signature');
            throw new Exception('Parameter yang diperlukan untuk generate signature tidak lengkap');
        }
        try {
            // 1. Buat payload dengan menggabungkan komponen-komponen
            $payload = $ssoToken . $state . $timestamp . $nonce;
            // 2. Buat 32-byte key dari signature secret
            $key = hash('sha256', $signatureSecret, true);
            // 3. Generate HMAC - SHA256
            $signature = hash_hmac('sha256', $payload, $key, true);
            // 4. Return signature yang di-encode base64
            Log::info('Generated signature: ' . base64_encode($signature));
            return base64_encode($signature);
        } catch (Exception $e) {
            error_log('Generate signature gagal: ' . $e->getMessage());
            throw $e;
        }
    }

    private function generateNonce(): string
    {
        $chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        $nonce = '';
        for ($i = 0; $i < 16; $i++) {
            $nonce .= $chars[rand(0, strlen($chars) - 1)];
        }
        Log::info('Generated Nonce: ' . $nonce);
        return $nonce;
    }

    /**
     * @param $apiKey
     * @param array $payload
     * @param string $url
     * @return array
     * @throws \Illuminate\Http\Client\ConnectionException
     */
    public function performApiRequest(string $apiKey, array $payload, string $url): array
    {
        $client = Http::withHeaders([
            'Content-Type' => 'application/json',
            'x-api-key' => $apiKey,
            // 'Origin' => request()->getSchemeAndHttpHost(), // or config('app.url')
        ])
            ->withBody(json_encode($payload), 'application/json');
        $response = $client->post($url);

        $responseData = $response->json();
        return array($response, $responseData);
    }

}
