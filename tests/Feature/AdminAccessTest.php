<?php

use App\Enums\RoleEnum;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

uses(RefreshDatabase::class);

beforeEach(function () {
    // Run migrations to create permission tables
    $this->artisan('migrate');

    // Create roles and permissions
    $adminRole = Role::create(['name' => RoleEnum::SUPER_ADMIN->value]);
    $userRole = Role::create(['name' => RoleEnum::USER->value]);

    $viewDashboardPermission = Permission::create(['name' => \App\Enums\PermissionEnum::VIEW_ADMIN_DASHBOARD->value]);
    $viewUsersPermission = Permission::create(['name' => \App\Enums\PermissionEnum::VIEW_USERS->value]);

    $adminRole->givePermissionTo([$viewDashboardPermission, $viewUsersPermission]);
    $userRole->givePermissionTo([$viewDashboardPermission]);
});

it('allows admin users to access admin routes', function () {
    $adminUser = User::factory()->create();
    $adminUser->assignRole(\App\Enums\RoleEnum::SUPER_ADMIN->value);

    $response = $this->actingAs($adminUser)->get(route('admin.dashboard'));

    $response->assertSuccessful();
});

it('denies non-admin users access to admin routes', function () {
    $regularUser = User::factory()->create();
    $regularUser->assignRole(RoleEnum::USER->value);

    $response = $this->actingAs($regularUser)->get(route('admin.dashboard'));

    $response->assertForbidden();
});

it('allows users with view dashboard permission to access dashboard', function () {
    $user = User::factory()->create();
    $user->givePermissionTo(\App\Enums\PermissionEnum::VIEW_ADMIN_DASHBOARD->value);

    $response = $this->actingAs($user)->get(route('admin.dashboard'));

    $response->assertSuccessful();
});

it('denies users without view dashboard permission', function () {
    $user = User::factory()->create();
    // User has no permissions

    $response = $this->actingAs($user)->get(route('admin.dashboard'));

    $response->assertForbidden();
});

it('shows user roles and permissions in admin dashboard', function () {
    $adminUser = User::factory()->create();
    $adminUser->assignRole(RoleEnum::SUPER_ADMIN->value);

    $response = $this->actingAs($adminUser)->get(route('admin.dashboard'));

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page->component(route('admin.dashboard'))
        ->has('user')
        ->has('stats')
    );
});
