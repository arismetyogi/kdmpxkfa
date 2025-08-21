<?php

namespace App\Services\Auth;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Firebase\JWT\ExpiredException;
use Firebase\JWT\SignatureInvalidException;
use Firebase\JWT\BeforeValidException;
use Illuminate\Support\Facades\Cache;

class JwtService
{
    private string $secret;
    private string $algorithm;
    private int $ttl;
    private int $refreshTtl;

    public function __construct()
    {
        $this->secret = config('jwt.secret') ?: config('app.key');
        $this->algorithm = config('jwt.algorithm', 'HS256');
        $this->ttl = config('jwt.ttl', 3600);
        $this->refreshTtl = config('jwt.refresh_ttl', 86400);
    }

    /**
     * Generate JWT token for user
     */
    public function generateToken(array $payload): string
    {
        $now = time();

        $tokenPayload = array_merge($payload, [
            'iat' => $now,
            'exp' => $now + $this->ttl,
            'nbf' => $now,
            'jti' => uniqid(),
        ]);

        return JWT::encode($tokenPayload, $this->secret, $this->algorithm);
    }

    /**
     * Generate refresh token
     */
    public function generateRefreshToken(array $payload): string
    {
        $now = time();

        $tokenPayload = array_merge($payload, [
            'iat' => $now,
            'exp' => $now + $this->refreshTtl,
            'nbf' => $now,
            'jti' => uniqid(),
            'type' => 'refresh'
        ]);

        return JWT::encode($tokenPayload, $this->secret, $this->algorithm);
    }

    /**
     * Decode and validate JWT token
     * @throws \Exception
     */
    public function validateToken(string $token): array
    {
        try {
            // Check if token is blacklisted
            if ($this->isBlacklisted($token)) {
                throw new \Exception('Token has been blacklisted');
            }

            $decoded = JWT::decode($token, new Key($this->secret, $this->algorithm));
            return (array) $decoded;

        } catch (ExpiredException $e) {
            throw new \Exception('Token has expired');
        } catch (SignatureInvalidException $e) {
            throw new \Exception('Token signature is invalid');
        } catch (BeforeValidException $e) {
            throw new \Exception('Token is not yet valid');
        } catch (\Exception $e) {
            throw new \Exception('Invalid token: ' . $e->getMessage());
        }
    }

    /**
     * Blacklist a token
     */
    public function blacklistToken(string $token): void
    {
        if (!config('jwt.blacklist_enabled')) {
            return;
        }

        try {
            $decoded = JWT::decode($token, new Key($this->secret, $this->algorithm));
            $jti = $decoded->jti ?? null;

            if ($jti) {
                $ttl = $decoded->exp - time();
                if ($ttl > 0) {
                    Cache::put("jwt_blacklist_{$jti}", true, $ttl);
                }
            }
        } catch (\Exception $e) {
            // Token is already invalid, no need to blacklist
        }
    }

    /**
     * Check if token is blacklisted
     */
    private function isBlacklisted(string $token): bool
    {
        if (!config('jwt.blacklist_enabled')) {
            return false;
        }

        try {
            $decoded = JWT::decode($token, new Key($this->secret, $this->algorithm));
            $jti = $decoded->jti ?? null;

            return $jti && Cache::has("jwt_blacklist_{$jti}");
        } catch (\Exception $e) {
            return false;
        }
    }

    /**
     * Refresh token
     * @throws \Exception
     */
    public function refreshToken(string $refreshToken): array
    {
        $payload = $this->validateToken($refreshToken);

        if (($payload['type'] ?? null) !== 'refresh') {
            throw new \Exception('Invalid refresh token');
        }

        // Blacklist old refresh token
        $this->blacklistToken($refreshToken);

        // Generate new tokens
        $userPayload = [
            'user_id' => $payload['user_id'],
            'email' => $payload['email'],
        ];

        return [
            'access_token' => $this->generateToken($userPayload),
            'refresh_token' => $this->generateRefreshToken($userPayload),
        ];
    }
}
