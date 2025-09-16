<?php

use App\Enums\PermissionEnum;

uses(Illuminate\Foundation\Testing\RefreshDatabase::class);

test('it has all required permissions', function () {
    // Test that all permissions exist
    expect(defined(PermissionEnum::class.'::VIEW_USERS'))->toBeTrue();
    expect(defined(PermissionEnum::class.'::CREATE_USERS'))->toBeTrue();
    expect(defined(PermissionEnum::class.'::UPDATE_USERS'))->toBeTrue();
    expect(defined(PermissionEnum::class.'::DELETE_USERS'))->toBeTrue();

    expect(defined(PermissionEnum::class.'::VIEW_ROLES'))->toBeTrue();
    expect(defined(PermissionEnum::class.'::CREATE_ROLES'))->toBeTrue();
    expect(defined(PermissionEnum::class.'::UPDATE_ROLES'))->toBeTrue();
    expect(defined(PermissionEnum::class.'::DELETE_ROLES'))->toBeTrue();

    expect(defined(PermissionEnum::class.'::VIEW_PERMISSIONS'))->toBeTrue();
    expect(defined(PermissionEnum::class.'::CREATE_PERMISSIONS'))->toBeTrue();
    expect(defined(PermissionEnum::class.'::UPDATE_PERMISSIONS'))->toBeTrue();
    expect(defined(PermissionEnum::class.'::DELETE_PERMISSIONS'))->toBeTrue();

    expect(defined(PermissionEnum::class.'::VIEW_DASHBOARD'))->toBeTrue();
    expect(defined(PermissionEnum::class.'::VIEW_ADMIN_DASHBOARD'))->toBeTrue();

    expect(defined(PermissionEnum::class.'::VIEW_PRODUCTS'))->toBeTrue();
    expect(defined(PermissionEnum::class.'::CREATE_PRODUCTS'))->toBeTrue();
    expect(defined(PermissionEnum::class.'::UPDATE_PRODUCTS'))->toBeTrue();
    expect(defined(PermissionEnum::class.'::DELETE_PRODUCTS'))->toBeTrue();

    expect(defined(PermissionEnum::class.'::VIEW_ORDERS'))->toBeTrue();
    expect(defined(PermissionEnum::class.'::CREATE_ORDERS'))->toBeTrue();
    expect(defined(PermissionEnum::class.'::UPDATE_ORDERS'))->toBeTrue();
    expect(defined(PermissionEnum::class.'::DELETE_ORDERS'))->toBeTrue();

    expect(defined(PermissionEnum::class.'::VIEW_REPORTS'))->toBeTrue();
    expect(defined(PermissionEnum::class.'::CREATE_REPORTS'))->toBeTrue();
});

test('it returns correct values', function () {
    expect(PermissionEnum::VIEW_USERS->value)->toBe('view users');
    expect(PermissionEnum::CREATE_USERS->value)->toBe('create users');
    expect(PermissionEnum::UPDATE_USERS->value)->toBe('update users');
    expect(PermissionEnum::DELETE_USERS->value)->toBe('delete users');

    expect(PermissionEnum::VIEW_ROLES->value)->toBe('view roles');
    expect(PermissionEnum::CREATE_ROLES->value)->toBe('create roles');
    expect(PermissionEnum::UPDATE_ROLES->value)->toBe('update roles');
    expect(PermissionEnum::DELETE_ROLES->value)->toBe('delete roles');

    expect(PermissionEnum::VIEW_DASHBOARD->value)->toBe('view dashboard');
    expect(PermissionEnum::VIEW_ADMIN_DASHBOARD->value)->toBe('view admin dashboard');

    expect(PermissionEnum::VIEW_PRODUCTS->value)->toBe('view products');
    expect(PermissionEnum::CREATE_PRODUCTS->value)->toBe('create products');
    expect(PermissionEnum::UPDATE_PRODUCTS->value)->toBe('update products');
    expect(PermissionEnum::DELETE_PRODUCTS->value)->toBe('delete products');
});

test('it returns correct labels', function () {
    expect(PermissionEnum::VIEW_USERS->label())->toBe('View Users');
    expect(PermissionEnum::CREATE_USERS->label())->toBe('Create Users');
    expect(PermissionEnum::UPDATE_USERS->label())->toBe('Update Users');
    expect(PermissionEnum::DELETE_USERS->label())->toBe('Delete Users');

    expect(PermissionEnum::VIEW_ROLES->label())->toBe('View Roles');
    expect(PermissionEnum::CREATE_ROLES->label())->toBe('Create Roles');
    expect(PermissionEnum::UPDATE_ROLES->label())->toBe('Update Roles');
    expect(PermissionEnum::DELETE_ROLES->label())->toBe('Delete Roles');

    expect(PermissionEnum::VIEW_DASHBOARD->label())->toBe('View Dashboard');
    expect(PermissionEnum::VIEW_ADMIN_DASHBOARD->label())->toBe('View Admin Dashboard');

    expect(PermissionEnum::VIEW_PRODUCTS->label())->toBe('View Products');
    expect(PermissionEnum::CREATE_PRODUCTS->label())->toBe('Create Products');
    expect(PermissionEnum::UPDATE_PRODUCTS->label())->toBe('Update Products');
    expect(PermissionEnum::DELETE_PRODUCTS->label())->toBe('Delete Products');
});

test('it returns all values', function () {
    $values = PermissionEnum::values();

    expect($values)->toContain('view users');
    expect($values)->toContain('create users');
    expect($values)->toContain('update users');
    expect($values)->toContain('delete users');

    expect($values)->toContain('view roles');
    expect($values)->toContain('create roles');
    expect($values)->toContain('update roles');
    expect($values)->toContain('delete roles');

    expect($values)->toContain('view dashboard');
    expect($values)->toContain('view admin dashboard');

    expect($values)->toContain('view products');
    expect($values)->toContain('create products');
    expect($values)->toContain('update products');
    expect($values)->toContain('delete products');

    // Check that we have the expected number of permissions
    expect($values)->toHaveCount(24);
});

test('it returns all labels', function () {
    $labels = PermissionEnum::labels();

    expect($labels)->toHaveKey('view users');
    expect($labels)->toHaveKey('create users');
    expect($labels)->toHaveKey('update users');
    expect($labels)->toHaveKey('delete users');

    expect($labels['view users'])->toBe('View Users');
    expect($labels['create users'])->toBe('Create Users');
    expect($labels['update users'])->toBe('Update Users');
    expect($labels['delete users'])->toBe('Delete Users');

    // Check that we have the expected number of labels
    expect($labels)->toHaveCount(24);
});

test('it groups permissions by category', function () {
    $userPermissions = PermissionEnum::userPermissions();
    expect($userPermissions)->toHaveCount(4);
    expect($userPermissions)->toContain(PermissionEnum::VIEW_USERS);
    expect($userPermissions)->toContain(PermissionEnum::CREATE_USERS);
    expect($userPermissions)->toContain(PermissionEnum::UPDATE_USERS);
    expect($userPermissions)->toContain(PermissionEnum::DELETE_USERS);

    $rolePermissions = PermissionEnum::rolePermissions();
    expect($rolePermissions)->toHaveCount(4);
    expect($rolePermissions)->toContain(PermissionEnum::VIEW_ROLES);
    expect($rolePermissions)->toContain(PermissionEnum::CREATE_ROLES);
    expect($rolePermissions)->toContain(PermissionEnum::UPDATE_ROLES);
    expect($rolePermissions)->toContain(PermissionEnum::DELETE_ROLES);

    $dashboardPermissions = PermissionEnum::dashboardPermissions();
    expect($dashboardPermissions)->toHaveCount(2);
    expect($dashboardPermissions)->toContain(PermissionEnum::VIEW_DASHBOARD);
    expect($dashboardPermissions)->toContain(PermissionEnum::VIEW_ADMIN_DASHBOARD);

    $productPermissions = PermissionEnum::productPermissions();
    expect($productPermissions)->toHaveCount(4);
    expect($productPermissions)->toContain(PermissionEnum::VIEW_PRODUCTS);
    expect($productPermissions)->toContain(PermissionEnum::CREATE_PRODUCTS);
    expect($productPermissions)->toContain(PermissionEnum::UPDATE_PRODUCTS);
    expect($productPermissions)->toContain(PermissionEnum::DELETE_PRODUCTS);
});