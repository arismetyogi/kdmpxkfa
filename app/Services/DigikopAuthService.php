<?php

namespace App\Services;

use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class DigikopAuthService
{
    private string $baseUrl;

    public function __construct()
    {
        $this->baseUrl = rtrim(config('transaction.digikoperasi.base_url'), '/');
        Log::debug('Base URL loaded: ' . $this->baseUrl);
    }

    /**
     * @throws ConnectionException
     */
    public function getAccessToken(): string
    {
        $token = Cache::get('digikoperasi_token');

        if (!$token) {
            $this->login(); // get new token
            $token = Cache::get('digikoperasi_token');
        }

        return $token;
    }

    /**
     * @throws ConnectionException
     * @throws \Exception
     */
    private function login(): void
    {
        $url = $this->baseUrl . '/koperasi-auth/login';

        $payload = [
            'access_key' => config('transaction.digikoperasi.access_key'),
            'access_secret' => config('transaction.digikoperasi.access_secret'),
        ];

        $response = Http::withBody(json_encode($payload))->post($url);
        $data = $response->json()['data']['data'] ?? null;

        if (!$data) {
            throw new \Exception('Failed to login to Digikoperasi');
        }

        Cache::put('digikoperasi_token', $data['token'], now()->addMinutes(55));
        Cache::put('digikoperasi_refresh', $data['refresh_token']);
    }

    /**
     * @throws ConnectionException
     */
    public function refreshToken(): void
    {
        $url = $this->baseUrl . '/koperasi-auth/refresh-token';
        $refreshToken = Cache::get('digikoperasi_refresh');

        if (!$refreshToken) {
            $this->login();
            return;
        }

        $response = Http::post($url, ['refresh_token' => $refreshToken]);
        $data = $response->json()['data']['data'] ?? null;

        if ($data) {
            Cache::put('digikoperasi_token', $data['token'], now()->addMinutes(55));
            Cache::put('digikoperasi_refresh', $data['refresh_token']);
        } else {
            $this->login(); // fallback
        }
    }
}
