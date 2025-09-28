<?php

use App\Http\Controllers\AccountManageController;
use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Admin\PermissionController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\SsoController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Auth\OnboardingController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Ecommerce\CartController;
use App\Http\Controllers\Ecommerce\HistoryController;
use App\Http\Controllers\Ecommerce\OrderController;
use App\Http\Controllers\MappingController;
use App\Http\Controllers\PurchaseController;
use App\Http\Controllers\TransactionController;
use App\Models\Order;
use App\Models\User;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
| Rute yang dapat diakses tanpa autentikasi.
*/
Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

//Route::get('sso/callback', [SsoController::class, 'callback']);
Route::get('sso/callback', function () {
    return Inertia::render('sso/callback', [
        'ssoBaseUrl' => config('sso.allowed_origins.digikoperasi.url')
    ]);
})->name('sso.callback');

Route::get('sso/decrypt', function () {
    // Sample data from the notes/decription.md
    $sampleData = [
        'sub' => '68c3cbdd787278153e8e9679',
        'email' => 'ZGFjNmJlOGE4NjMzYTU0MmVlOGY4M2VhOTMxMzE0MjA6Nzc1MjJkOGVmN2NiOWE3NjkxYmQyMGQ2ZWY3M2ExZjE3Y2EzNzc1ZTc4MjFmMWY3YmYxMDI0YWNkMGIwMmYxZA==',
        'email_verified' => false,
        'tenant_id' => '1673050000105',
        'tenant_name' => 'KOPERASI DESA MERAH PUTIH TUMBANG KUBANG',
        'name' => 'DEV 10',
        'phone' => '089531502394',
        'account_status' => 'active',
        'two_factor_enabled' => false,
        'last_login' => '2025-09-19T06:55:10.641Z',
        'sso_validated_at' => '2025-09-19T09:06:55.321Z',
        'source_app' => 'digikoperasi',
        'final_redirect_url' => 'http://testing-app.id',
        'province_code' => '62',
        'regency_city_code' => '62.07',
        'district_code' => '62.07.05',
        'village_code' => '62.07.05.2031',
        'registered_address' => 'Desa Tumbang Kubang, Kecamatan Seruyan Hulu, Kabupaten Seruyan.',
        'nik' => 'MjgxNDMxYWU0ZTYzNGZhZDE5YzkxYjc4NzNiMDJmZmU6NjA0MzU4NGI3YTNmMmIxMmVkYzZhYjA2NmY2N2Q5N2UzMjY2OGFlOGE3MDIwN2I0ZTA1ODFmYmY0YmVmNjFlOQ==',
        'pic_name' => 'YmMxN2Q0MDI4MWQ5ZWE5ZGI0ZGEyNDAyODVlY2NlNTQ6ZjJlM2MyNmQ0ZTY4ZDVmZDZjZmE1Y2U2MjM0Y2FlMjM=',
        'pic_phone' => 'NjgyMTY5YjQxZGEwNGFkZjFlYTU1Y2JhY2JjMjYyNzA6YjFiNzQxYmFiYmMxNTdhNDdiYWI0MzFiMzk0ZDdkMTM=',
        'latitude' => '-1.1020068',
        'longitude' => '111.6207765',
        'nib_number' => 'N2M2MjQzNDVkNTlkMTExMTZmYjczNTc4YTEzODRkNDg6MWU5MGQyZWYzZmJlMDIyNTYwNGFkM2M1MjVmNTY2YWE=',
        'bank_account' => null,
        'npwp_number' => 'MWZjYmEwZGEwYzBlOGViMjBiNDIwOWFmZjlhNDU2YjI6NmViYWVjZmU3NWM1MTk4ZDBlMTRiY2Y1NzJkYzhiYmY1NjQ2NWJiNzEwMGI2NmMyYjM4NTFjYmE0ZTRhY2NkNQ==',
        'sk_number' => 'ZTM1YTQyOWQwOTg5NDg1MTBiNGM2ZTI1N2NmMWZiOTg6OTg2NWVkZWI2ZWM2ODg2YzIyMjcxYzY5OTZiNjYzYWU0MTIxZjcwYzMzNDE3NDZlN2EzOWQwMWE5MmQ3NTNkZGZkMTRhMWRhNjQ2YmNkOGNhMjJmYTU0NjYxMzZiNGI5',
        'nib_file' => 'https://storage.googleapis.com/kopdes-merah-putih-dev/nib_file/nib_1757660768.pdf',
        'ktp_file' => 'https://storage.googleapis.com/kopdes-merah-putih-dev/business-partnership/pic-ktp/ktp_Y2xFU5yPFkIFesiw_1758002071.pdf',
        'npwp_file' => 'https://storage.googleapis.com/kopdes-merah-putih-dev/npwp_file/npwp_1757660750.pdf',
    ];

    return Inertia::render('sso/decrypt', [
        'sampleData' => $sampleData,
    ]);
});
Route::post('refresh', [SsoController::class, 'refresh']);
Route::get('form-koperasi', function () {
    return Inertia::render('cooperation-request');
})->name('cooperation-request');
Route::post('form-koperasi', [App\Http\Controllers\CooperationController::class, 'store'])->name('cooperation.store');


/*
|--------------------------------------------------------------------------
| Authenticated User Routes
|--------------------------------------------------------------------------
| Rute untuk pengguna yang sudah login (termasuk admin).
*/
Route::middleware(['auth'])->group(function () {
    // Onboarding adalah langkah pertama setelah otentikasi
    Route::get('/onboarding', [OnboardingController::class, 'create'])->name('onboarding.create');
    Route::post('/onboarding', [OnboardingController::class, 'store'])->name('onboarding.store');
});

Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard untuk pengguna biasa
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/credit-limit', [TransactionController::class, 'creditLimit'])->name('credit.limit');

    // Region routes
    Route::prefix('regions')->group(function () {
        Route::get('/provinces', [App\Http\Controllers\RegionController::class, 'provinces']);
        Route::get('/cities/{provinceCode}', [App\Http\Controllers\RegionController::class, 'cities']);
        Route::get('/districts/{cityCode}', [App\Http\Controllers\RegionController::class, 'districts']);
        Route::get('/villages/{districtCode}', [App\Http\Controllers\RegionController::class, 'villages']);
    });

    // Rute E-commerce untuk pengguna
    Route::get('/orders/products', [OrderController::class, 'index'])->name('orders.products');
    Route::get('/packages', [\App\Http\Controllers\Ecommerce\PackageController::class, 'index'])->name('packages.index');
    Route::get('orders/products/{product}', [OrderController::class, 'show'])->name('orders.show');
    // Route::get('/orders/history', [OrderController::class, 'history'])->name('orders.history');
    Route::post('/orders/{order}/accept', [OrderController::class, 'acceptOrder'])->name('orders.accept');
    Route::get('/cart', [OrderController::class, 'cart'])->name('cart');
    Route::get('/checkout', [CartController::class, 'checkoutForm'])->name('checkout');
    Route::get('/payment', [CartController::class, 'paymentForm'])->name('payment');
    Route::post('/checkout/process', [CartController::class, 'processCheckout'])->name('checkout.process');
    Route::post('/payment/process', [CartController::class, 'processPayment'])->name('payment.process');
    Route::get('/order-complete/{order}', [CartController::class, 'orderComplete'])->name('order.complete');

    // Grouping rute History untuk konsistensi
    Route::prefix('orders/history')->name('history.')->group(function () {
        Route::get('/', [HistoryController::class, 'history'])->name('index');
        Route::get('{transaction_number}', [HistoryController::class, 'show'])->name('show');
        Route::get('{transaction_number}/details', [HistoryController::class, 'show'])->name('details');
        Route::post('{transaction_number}/updateStatus', [HistoryController::class, 'updateStatus'])->name('updateStatus');
    });

    /*
    |--------------------------------------------------------------------------
    | Admin Routes
    |--------------------------------------------------------------------------
    | Semua rute untuk admin berada di dalam group ini dengan middleware khusus.
    */
    Route::middleware('permission:'.\App\Enums\PermissionEnum::VIEW_ADMIN_DASHBOARD->value)->prefix('admin')->name('admin.')->group(function () {
        Route::get('/dashboard', [AdminController::class, 'dashboard'])->name('dashboard');

        // Rute untuk manajemen Pembelian (Purchase Orders)
        Route::prefix('purchase')->name('purchase.')->group(function () {
            Route::get('/', [PurchaseController::class, 'index'])->name('index');
            Route::get('/{purchase}', [PurchaseController::class, 'show'])->name('show');
            Route::post('/{purchase}/accept', [PurchaseController::class, 'accept'])->name('accept');
            Route::post('/{purchase}/reject', [PurchaseController::class, 'reject'])->name('reject');
        });

        Route::prefix('admin/account')->name('account.')->group(function () {
            Route::get('/', [AccountManageController::class, 'index'])->name('index');
            Route::post('/{user}/approve', [AccountManageController::class, 'approve'])->name('approve');
            Route::post('/{user}/reject', [AccountManageController::class, 'reject'])->name('reject');
        });


        Route::prefix('mapping')->name('mapping.')->group(function () {
            Route::get('/', [MappingController::class, 'index'])->name('index');
            Route::post('/{user}/map', [MappingController::class, 'mapUser'])->name('map');
        });

        // Rute CRUD Resources
        Route::resource('permissions', PermissionController::class)->except(['show', 'edit']);
        Route::resource('admins', AdminController::class);
        Route::resource('users', UserController::class)->except('edit');
        Route::resource('products', ProductController::class);
        Route::resource('categories', \App\Http\Controllers\Admin\CategoryController::class);

        // Rute dengan permission spesifik untuk Orders
        Route::middleware('permission:'.\App\Enums\PermissionEnum::VIEW_ORDERS->value)->group(function () {
            Route::resource('orders', \App\Http\Controllers\Admin\OrderController::class);
        });

        // Rute untuk manajemen Roles
        Route::prefix('roles')->name('roles.')->group(function () {
            Route::get('/', [AdminController::class, 'roles'])->name('index');
            Route::post('/', [AdminController::class, 'storeRole'])->name('store');
            Route::put('/{role}', [AdminController::class, 'updateRole'])->name('update');
            Route::delete('/{role}', [AdminController::class, 'destroyRole'])->name('destroy');
        });

        // Rute lain-lain
        Route::post('users/{user}/map', [UserController::class, 'mapUser'])->name('users.map');
    });
});

/*
|--------------------------------------------------------------------------
| Route Model Bindings
|--------------------------------------------------------------------------
|
| Laravel secara otomatis akan mencari model berdasarkan ID. Bindings di bawah
| ini memastikan model ditemukan atau mengembalikan 404.
|
*/
Route::bind('role', function ($value) {
    return \Spatie\Permission\Models\Role::findOrFail($value);
});
Route::bind('permission', function ($value) {
    return \Spatie\Permission\Models\Permission::findOrFail($value);
});
Route::bind('user', function ($value) {
    return User::findOrFail($value);
});

Route::bind('order', function ($value) {
    return Order::findOrFail($value);
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
