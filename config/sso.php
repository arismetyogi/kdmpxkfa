<?php


return [
    /*
    |--------------------------------------------------------------------------
    | Allowed SSO Origins
    |--------------------------------------------------------------------------
    |
    | Configure the allowed origin applications that can authenticate users
    | through SSO. Each origin should have its own configuration.
    |
    */
    'allowed_origins' => [
        'digikoperasi' => [
            'url' => env('SSO_DIGIKOPERASI_URL', 'https://gatekeeper-stg.berasumkm.id'),
            'api_key' => env('SSO_DIGIKOPERASI_API_KEY'),
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Token Configuration
    |--------------------------------------------------------------------------
    |
    | Configure token expiration times and refresh settings.
    |
    */
    'token_expiry' => env('SSO_TOKEN_EXPIRY', 3600), // 1 hour
    'refresh_token_expiry' => env('SSO_REFRESH_TOKEN_EXPIRY', 86400), // 24 hours
    'session_expiry' => env('SSO_SESSION_EXPIRY', 7200), // 2 hours

    /*
    |--------------------------------------------------------------------------
    | Redirect URLs
    |--------------------------------------------------------------------------
    |
    | Configure default redirect URLs for successful and failed authentication.
    |
    */
    'redirect_urls' => [
        'success' => env('SSO_SUCCESS_REDIRECT', '/dashboard'),
        'failure' => env('SSO_FAILURE_REDIRECT', '/login?error=sso_failed'),
        'onboarding' => env('SSO_ONBOARDING_REDIRECT', '/onboarding'),
    ],

    /*
    |--------------------------------------------------------------------------
    | Security Settings
    |--------------------------------------------------------------------------
    |
    | Configure security-related settings for SSO authentication.
    |
    */
    'security' => [
        'validate_issuer' => env('SSO_VALIDATE_ISSUER', true),
        'validate_audience' => env('SSO_VALIDATE_AUDIENCE', true),
        'leeway' => env('SSO_JWT_LEEWAY', 60), // seconds
        'max_session_duration' => env('SSO_MAX_SESSION_DURATION', 86400), // 24 hours
    ],

    /*
    |--------------------------------------------------------------------------
    | Rate Limiting
    |--------------------------------------------------------------------------
    |
    | Configure rate limiting for SSO endpoints to prevent abuse.
    |
    */
    'rate_limiting' => [
        'callback_attempts' => env('SSO_CALLBACK_RATE_LIMIT', 10), // per minute
        'refresh_attempts' => env('SSO_REFRESH_RATE_LIMIT', 20), // per minute
    ],
];
