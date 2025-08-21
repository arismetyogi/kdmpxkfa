<?php

return [
    /*
    |--------------------------------------------------------------------------
    | JWT Configuration
    |--------------------------------------------------------------------------
    |
    | Configuration for Firebase JWT implementation
    |
    */

    'secret' => env('SSO_DSN_SECRET'),

    'algorithm' => env('SSO_DIGIKOPERASI_ALGORITHM','HS256'),

    'ttl' => env('SSO_TOKEN_EXPIRY', 3600), // 1 hour

    'refresh_ttl' => env('SSO_REFRESH_TOKEN_EXPIRY', 86400), // 24 hours

    'leeway' => env('JWT_LEEWAY', 0),

    'blacklist_enabled' => env('JWT_BLACKLIST_ENABLED', true),

    'blacklist_grace_period' => env('JWT_BLACKLIST_GRACE_PERIOD', 0),

    'providers' => [
        'jwt' => Firebase\JWT\JWT::class,
    ],
];
