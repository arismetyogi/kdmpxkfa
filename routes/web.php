<?php

use App\Enums\PermissionEnum;
use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\PermissionController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\SsoController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\OrderController as AdminOrderController;
use App\Http\Controllers\Auth\OnboardingController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\MappingController;
use App\Http\Controllers\PurchaseController;
use App\Http\Controllers\AccountManageController;
use App\Http\Controllers\Ecommerce\CartController;
use App\Http\Controllers\Ecommerce\HistoryController;
use App\Http\Controllers\Ecommerce\OrderController;
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

Route::get('sso/callback', [SsoController::class, 'callback']);
Route::post('refresh', [SsoController::class, 'refresh']);

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

    // Rute E-commerce untuk pengguna
    Route::get('/orders/products', [OrderController::class, 'index'])->name('orders.products');
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
    Route::middleware('permission:' . \App\Enums\PermissionEnum::VIEW_ADMIN_DASHBOARD->value)->prefix('admin')->name('admin.')->group(function () {
        Route::get('/dashboard', [AdminController::class, 'dashboard'])->name('dashboard');

        // Rute untuk manajemen Pembelian (Purchase Orders)
        Route::prefix('purchase')->name('purchase.')->group(function () {
            Route::get('/', [PurchaseController::class, 'index'])->name('index');
            Route::get('/{purchase}', [PurchaseController::class, 'show'])->name('show');
            Route::post('/{purchase}/accept', [PurchaseController::class, 'accept'])->name('accept');
            Route::post('/{purchase}/reject', [PurchaseController::class, 'reject'])->name('reject');
        });

        // Rute untuk manajemen Mapping dan Akun
        Route::get('/mapping', [MappingController::class, 'index'])->name('mapping.index');
        Route::get('/account', [AccountManageController::class, 'index'])->name('account.index');

        // Rute CRUD Resources
        Route::resource('permissions', PermissionController::class)->except(['show', 'edit']);
        Route::resource('admins', AdminController::class);
        Route::resource('users', UserController::class)->except('edit');
        Route::resource('products', ProductController::class);
        Route::resource('categories', \App\Http\Controllers\Admin\CategoryController::class);

        // Rute dengan permission spesifik untuk Orders
        Route::middleware('permission:' . \App\Enums\PermissionEnum::VIEW_ORDERS->value)->group(function () {
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
    return  \Spatie\Permission\Models\Role::findOrFail($value);
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
