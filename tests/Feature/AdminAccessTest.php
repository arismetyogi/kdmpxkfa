<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

uses(RefreshDatabase::class);

beforeEach(function () {
    // Run migrations to create permission tables
    $this->artisan('migrate');

    // Create roles and permissions
    $adminRole = Role::create(['name' => 'admin']);
    $userRole = Role::create(['name' => 'user']);

    $viewDashboardPermission = Permission::create(['name' => 'view dashboard']);
    $viewUsersPermission = Permission::create(['name' => 'view users']);

    $adminRole->givePermissionTo([$viewDashboardPermission, $viewUsersPermission]);
    $userRole->givePermissionTo([$viewDashboardPermission]);
});

it('allows admin users to access admin routes', function () {
    $adminUser = User::factory()->create();
    $adminUser->assignRole('admin');

    $response = $this->actingAs($adminUser)->get('/admin');

    $response->assertSuccessful();
});

it('denies non-admin users access to admin routes', function () {
    $regularUser = User::factory()->create();
    $regularUser->assignRole('user');

    $response = $this->actingAs($regularUser)->get('/admin');

    $response->assertForbidden();
});

it('allows users with view dashboard permission to access dashboard', function () {
    $user = User::factory()->create();
    $user->givePermissionTo('view dashboard');

    $response = $this->actingAs($user)->get('/admin/dashboard-alt');

    $response->assertSuccessful();
});

it('denies users without view dashboard permission', function () {
    $user = User::factory()->create();
    // User has no permissions

    $response = $this->actingAs($user)->get('/admin/dashboard-alt');

    $response->assertForbidden();
});

it('shows user roles and permissions in admin dashboard', function () {
    $adminUser = User::factory()->create();
    $adminUser->assignRole('admin');

    $response = $this->actingAs($adminUser)->get('/admin');

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page->component('admin/Dashboard')
        ->has('user')
        ->has('stats')
    );
});
