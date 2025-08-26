<?php

use App\Http\Controllers\Api\SsoController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Public routes
Route::prefix('v1')->group(function () {
    // Authentication routes
    Route::prefix('auth')->group(function () {
        Route::get('sso/callback', [SsoController::class, 'callback']);
        Route::post('refresh', [SsoController::class, 'refresh']);
    });

    Route::get('/products', [\App\Http\Controllers\Api\ProductController::class, 'index']);

    // Public product routes
//    Route::get('products', [ProductController::class, 'index']);
//    Route::get('products/{product}', [ProductController::class, 'show']);
});

// Protected routes
Route::prefix('v1')->middleware(['auth:api'])->group(function () {
    // Authentication management
    Route::prefix('auth')->group(function () {
        Route::get('me', [SsoController::class, 'me']);
        Route::post('logout', [SsoController::class, 'logout']);
    });

    // Onboarding routes (accessible even without completed onboarding)
//    Route::prefix('onboarding')->group(function () {
//        Route::get('status', [OnboardingController::class, 'status']);
//        Route::post('complete', [OnboardingController::class, 'complete']);
//    });
//
//    // Routes requiring completed onboarding
//    Route::middleware(['check.onboarding'])->group(function () {
//        // User profile management
//        Route::prefix('profile')->group(function () {
//            Route::get('/', [ProfileController::class, 'show']);
//            Route::put('/', [ProfileController::class, 'update']);
//            Route::post('avatar', [ProfileController::class, 'uploadAvatar']);
//        });
//
//        // Cart management
//        Route::prefix('cart')->group(function () {
//            Route::get('/', [CartController::class, 'index']);
//            Route::post('items', [CartController::class, 'addItem']);
//            Route::put('items/{item}', [CartController::class, 'updateItem']);
//            Route::delete('items/{item}', [CartController::class, 'removeItem']);
//            Route::delete('clear', [CartController::class, 'clear']);
//        });
//
//        // Order management
//        Route::prefix('orders')->group(function () {
//            Route::get('/', [OrderController::class, 'index']);
//            Route::post('/', [OrderController::class, 'store']);
//            Route::get('{order}', [OrderController::class, 'show']);
//            Route::put('{order}/cancel', [OrderController::class, 'cancel']);
//        });
//    });
});
