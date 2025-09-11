<?php

namespace App\Enums;

enum PermissionEnum: string
{
    // User permissions
    case VIEW_USERS = 'view users';
    case CREATE_USERS = 'create users';
    case UPDATE_USERS = 'update users';
    case DELETE_USERS = 'delete users';

    // Role permissions
    case VIEW_ROLES = 'view roles';
    case CREATE_ROLES = 'create roles';
    case UPDATE_ROLES = 'update roles';
    case DELETE_ROLES = 'delete roles';

    // Permission permissions
    case VIEW_PERMISSIONS = 'view permissions';
    case CREATE_PERMISSIONS = 'create permissions';
    case UPDATE_PERMISSIONS = 'update permissions';
    case DELETE_PERMISSIONS = 'delete permissions';

    // Dashboard permissions
    case VIEW_DASHBOARD = 'view dashboard';
    case VIEW_ADMIN_DASHBOARD = 'view admin dashboard';

    // Product permissions
    case VIEW_PRODUCTS = 'view products';
    case CREATE_PRODUCTS = 'create products';
    case UPDATE_PRODUCTS = 'update products';
    case DELETE_PRODUCTS = 'delete products';

    // Order permissions
    case VIEW_ORDERS = 'view orders';
    case CREATE_ORDERS = 'create orders';
    case UPDATE_ORDERS = 'update orders';
    case DELETE_ORDERS = 'delete orders';

    // Report permissions
    case VIEW_REPORTS = 'view reports';
    case CREATE_REPORTS = 'create reports';

    public function label(): string
    {
        return match ($this) {
            // User permissions
            self::VIEW_USERS => 'View Users',
            self::CREATE_USERS => 'Create Users',
            self::UPDATE_USERS => 'Update Users',
            self::DELETE_USERS => 'Delete Users',

            // Role permissions
            self::VIEW_ROLES => 'View Roles',
            self::CREATE_ROLES => 'Create Roles',
            self::UPDATE_ROLES => 'Update Roles',
            self::DELETE_ROLES => 'Delete Roles',

            // Permission permissions
            self::VIEW_PERMISSIONS => 'View Permissions',
            self::CREATE_PERMISSIONS => 'Create Permissions',
            self::UPDATE_PERMISSIONS => 'Update Permissions',
            self::DELETE_PERMISSIONS => 'Delete Permissions',

            // Dashboard permissions
            self::VIEW_DASHBOARD => 'View Dashboard',
            self::VIEW_ADMIN_DASHBOARD => 'View Admin Dashboard',

            // Product permissions
            self::VIEW_PRODUCTS => 'View Products',
            self::CREATE_PRODUCTS => 'Create Products',
            self::UPDATE_PRODUCTS => 'Update Products',
            self::DELETE_PRODUCTS => 'Delete Products',

            // Order permissions
            self::VIEW_ORDERS => 'View Orders',
            self::CREATE_ORDERS => 'Create Orders',
            self::UPDATE_ORDERS => 'Update Orders',
            self::DELETE_ORDERS => 'Delete Orders',

            // Report permissions
            self::VIEW_REPORTS => 'View Reports',
            self::CREATE_REPORTS => 'Create Reports',
        };
    }

    public static function labels(): array
    {
        $labels = [];
        foreach (self::cases() as $case) {
            $labels[$case->value] = $case->label();
        }
        return $labels;
    }

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    /**
     * Get permissions by category
     */
    public static function userPermissions(): array
    {
        return [
            self::VIEW_USERS,
            self::CREATE_USERS,
            self::UPDATE_USERS,
            self::DELETE_USERS,
        ];
    }

    public static function rolePermissions(): array
    {
        return [
            self::VIEW_ROLES,
            self::CREATE_ROLES,
            self::UPDATE_ROLES,
            self::DELETE_ROLES,
        ];
    }

    public static function permissionPermissions(): array
    {
        return [
            self::VIEW_PERMISSIONS,
            self::CREATE_PERMISSIONS,
            self::UPDATE_PERMISSIONS,
            self::DELETE_PERMISSIONS,
        ];
    }

    public static function dashboardPermissions(): array
    {
        return [
            self::VIEW_DASHBOARD,
            self::VIEW_ADMIN_DASHBOARD,
        ];
    }

    public static function productPermissions(): array
    {
        return [
            self::VIEW_PRODUCTS,
            self::CREATE_PRODUCTS,
            self::UPDATE_PRODUCTS,
            self::DELETE_PRODUCTS,
        ];
    }

    public static function orderPermissions(): array
    {
        return [
            self::VIEW_ORDERS,
            self::CREATE_ORDERS,
            self::UPDATE_ORDERS,
            self::DELETE_ORDERS,
        ];
    }

    public static function reportPermissions(): array
    {
        return [
            self::VIEW_REPORTS,
            self::CREATE_REPORTS,
        ];
    }
}