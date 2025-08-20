<?php

use App\Http\Controllers\AdminController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    // Regular user dashboard
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');

    // Admin routes with role-based access
    Route::middleware(['role:admin'])->prefix('admin')->name('admin.')->group(function () {
        Route::get('/', [AdminController::class, 'dashboard'])->name('dashboard');
        Route::get('/roles', [AdminController::class, 'roles'])->name('roles');
        Route::get('/permissions', [AdminController::class, 'permissions'])->name('permissions');
        Route::get('/users', [AdminController::class, 'users'])->name('users');
    });

    // Alternative: Use permission-based middleware
    Route::middleware(['permission:view dashboard'])->prefix('admin')->name('admin.')->group(function () {
        Route::get('/dashboard-alt', [AdminController::class, 'dashboard'])->name('dashboard-alt');
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
