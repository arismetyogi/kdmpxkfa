<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\Auth\SsoService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class SsoFrontendController extends Controller
{
    public function __construct(
        private readonly SsoService $ssoService
    ) {}

    /**
     * Get SSO configuration for frontend
     */
    public function getConfig(): JsonResponse
    {
        try {
            $ssoConfig = [
                'digikoperasi' => [
                    'url' => config('sso.allowed_origins.digikoperasi.url'),
                    'api_key' => config('sso.allowed_origins.digikoperasi.api_key'),
                ]
            ];

            return response()->json([
                'ssoConfig' => $ssoConfig,
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to retrieve SSO config', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'message' => 'Failed to retrieve SSO configuration',
            ], 500);
        }
    }

    /**
     * Handle user login after SSO validation from frontend
     */
    public function login(Request $request)
    {
        try {
            $userData = $request->input('user_data');

            if (!$userData) {
                return response()->json([
                    'message' => 'User data is required',
                ], 400);
            }

            // Find or create user based on SSO data
            $user = $this->findOrCreateUser($userData);

            // Create SSO session (similar to backend implementation)
            $this->createSSOSession($user, [
                'sso_token' => $request->input('sso_token'),
                'state' => $request->input('state'),
            ], $userData);

            $result = [
                'user' => $user,
                'requires_onboarding' => !$user->onboarding_completed,
            ];

            // Add prefilled data for onboarding if needed
            if (!$user->onboarding_completed) {
                $result['prefilled_data'] = $this->getPrefilledData($userData);
            }

            return response()->json($result);

        } catch (\Exception $e) {
            Log::error('SSO frontend login failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'message' => 'SSO login failed: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Find existing user or create new one based on SSO data
     */
    private function findOrCreateUser(array $userData)
    {
        // Try to find user by external ID first
        $user = \App\Models\User::where('external_id', $userData['sub'])->first();

        // If no user found by external ID, try by email
        if (!$user && isset($userData['email'])) {
            $email = $this->ssoService->decryptSsoField($userData['email']) ?? null;
            if ($email) {
                $user = \App\Models\User::where('email', $email)->first();
            }
        }

        // If no user found, create a new one
        if (!$user) {
            $email = $this->ssoService->decryptSsoField($userData['email']) ?? null;

            $user = \App\Models\User::create([
                'uuid' => \Illuminate\Support\Str::uuid(),
                'name' => $userData['name'],
                'username' => \Illuminate\Support\Str::before($email, '@'),
                'email' => $email,
                'email_verified_at' => now(),
                'onboarding_completed' => false, // Set to false to redirect to onboarding
                'external_id' => $userData['sub'],
                'tenant_id' => $userData['tenant_id'],
                'tenant_name' => $userData['tenant_name'],
                'phone' => $userData['phone'],
                'is_active' => true,
            ]);

            $user->assignRole('user');

            // Create user profile
            $this->createUserProfile($user, $userData);
        }

        return $user;
    }

    /**
     * Create user profile from SSO data
     * @throws \Exception
     */
    private function createUserProfile($user, array $userData)
    {
        // Decrypt sensitive fields
        $decryptedNik = $this->ssoService->decryptSsoField($userData['nik']) ?? '';
        $decryptedPicName = $this->ssoService->decryptSsoField($userData['pic_name']) ?? '';
        $decryptedPicPhone = $this->ssoService->decryptSsoField($userData['pic_phone']) ?? '';
        $decryptedNibNumber = $this->ssoService->decryptSsoField($userData['nib_number']) ?? '';
        $decryptedBankAccount = (array) $this->ssoService->decryptSsoField($userData['bank_account']) ?? [];
        $decryptedNpwp = $this->ssoService->decryptSsoField($userData['npwp_number']) ?? '';
        $decryptedSkNumber = $this->ssoService->decryptSsoField($userData['sk_number']) ?? '';

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
            return $user;
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
    private function createSSOSession($user, array $callbackData, array $userData): void
    {
        // Regenerate session ID for security (avoid session fixation)
        \Illuminate\Support\Facades\Auth::login($user);
        \Illuminate\Support\Facades\Session::regenerate(true);

        // Store metadata in the Laravel session
        \Illuminate\Support\Facades\Session::put('sso', [
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
            'email' => $this->ssoService->decryptSsoField($userData['email']) ?? null,
            'name' => $userData['name'] ?? null,
            'phone' => $userData['phone'] ?? null,
            'tenant_id' => $userData['tenant_id'] ?? null,
            'tenant_name' => $userData['tenant_name'] ?? null,
            'address' => $userData['registered_address'],
            'latitude' => (float) $userData['latitude'] ?? null,
            'longitude' => (float) $userData['longitude'] ?? null,
        ];
    }
}
