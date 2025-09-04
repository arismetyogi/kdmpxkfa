<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\Auth\OnboardingController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\SsoController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::get('sso/callback', [SsoController::class, 'callback']);
Route::post('refresh', [SsoController::class, 'refresh']);

Route::middleware('auth')->group(function () {
    Route::get('/onboarding', [OnboardingController::class, 'create'])->name('onboarding.create');
    Route::post('/onboarding', [OnboardingController::class, 'store'])->name('onboarding.store');
});

Route::middleware(['auth', 'verified'])->group(function () {
    // Regular user dashboard
    Route::get('/dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('/orders/products', [OrderController::class , 'index'])->name('orders.products');
//    Route::get('/orders/cart', [OrderController::class , 'cart'])->name('orders.cart');
//    Route::get('/orders/po', [OrderController::class , 'po'])->name('orders.po');
//    Route::get('/orders/history', [OrderController::class , 'history'])->name('orders.history');

    Route::resource('carts', CartController::class);
    Route::get('/checkout', [CartController::class, 'checkoutForm'])->name('checkout');
    Route::get('/payment', [CartController::class, 'paymentForm'])->name('payment');
    Route::post('/checkout/process', [CartController::class, 'processCheckout'])->name('checkout.process');
    Route::post('/payment/process', [CartController::class, 'processPayment'])->name('payment.process');
    Route::get('/order-complete/{order}', [CartController::class, 'orderComplete'])->name('order.complete');


//    Route::get('penerimaan', [PenerimaanController::class , 'index'])->name('penerimaan');
//    Route::get('penerimaan/history', [PenerimaanController::class , 'create'])->name('history');

    // Admin routes with role-based access
    Route::middleware(['role:admins|super-admin'])->prefix('admin')->name('admin.')->group(function () {
        Route::get('/', [AdminController::class, 'dashboard'])->name('dashboard');

        // Role management routes with explicit model binding
        Route::prefix('roles')->name('roles.')->group(function () {
            Route::get('/', [AdminController::class, 'roles'])->name('index');
            Route::post('/', [AdminController::class, 'storeRole'])->name('store');
            Route::put('/{role}', [AdminController::class, 'updateRole'])->name('update');
            Route::delete('/{role}', [AdminController::class, 'destroyRole'])->name('destroy');
        });

        Route::prefix('permissions')->name('permissions.')->group(function () {
            Route::get('/', [AdminController::class, 'permissions'])->name('index');
            Route::post('/', [AdminController::class, 'storePermission'])->name('store');
        });
        // User management routes with explicit model binding
        Route::resource('users',UserController::class);

        // Product management routes with explicit model binding
        Route::resource('products',ProductController::class);
        
        // Category management routes
        Route::resource('categories', App\Http\Controllers\CategoryController::class);
    });

    // Alternative: Use permission-based middleware
    Route::middleware(['permission:view dashboard'])->prefix('admin')->name('admin.')->group(function () {
        Route::get('/dashboard-alt', [AdminController::class, 'dashboard'])->name('dashboard-alt');
    });
});

// Add explicit route model binding for Role
Route::bind('role', function ($value) {
    return \Spatie\Permission\Models\Role::findOrFail($value);
});
// Add explicit route model binding for Permission
Route::bind('permission', function ($value) {
    return \Spatie\Permission\Models\Permission::findOrFail($value);
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
