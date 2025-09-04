<?php

return [
    /*
    |--------------------------------------------------------------------------
    | API Configs
    |--------------------------------------------------------------------------
    |
    | Configure the allowed origin applications that can authenticate users
    | through SSO. Each origin should have its own configuration.
    |
    */
    'digikoperasi' => [
        'base_url' => env('DIGIKOPERASI_TRANSACTIONS_BASE_URL', 'https://openapi-stage.berasumkm.id/api/v2/koperasi'),
        'access_key' => env('DIGIKOPERASI_TRANSACTIONS_ACCESS_KEY'),
        'access_secret' => env('DIGIKOPERASI_TRANSACTIONS_ACCESS_SECRET')
    ]
];
