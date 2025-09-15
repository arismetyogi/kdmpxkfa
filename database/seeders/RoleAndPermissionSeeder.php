<?php

namespace Database\Seeders;

use App\Enums\PermissionEnum;
use App\Enums\RoleEnum;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleAndPermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Create permissions using PermissionEnum, handling existing permissions
        foreach (PermissionEnum::cases() as $permission) {
            Permission::firstOrCreate(['name' => $permission->value]);
        }

        // Create roles and assign permissions
        $superAdminRole = Role::firstOrCreate(['name' => RoleEnum::SUPER_ADMIN->value]);
        // Clear existing permissions for this role
        DB::table('role_has_permissions')
            ->where('role_id', $superAdminRole->id)
            ->delete();
        $superAdminRole->givePermissionTo(Permission::all());

        $adminRole = Role::firstOrCreate(['name' => RoleEnum::ADMIN_BUSDEV->value]);
        // Clear existing permissions for this role
        DB::table('role_has_permissions')
            ->where('role_id', $adminRole->id)
            ->delete();
        $adminRole->givePermissionTo([
            PermissionEnum::VIEW_USERS->value,
            PermissionEnum::CREATE_USERS->value,
            PermissionEnum::UPDATE_USERS->value,
            PermissionEnum::VIEW_ROLES->value,
            PermissionEnum::CREATE_ROLES->value,
            PermissionEnum::UPDATE_ROLES->value,
            PermissionEnum::VIEW_PERMISSIONS->value,
            PermissionEnum::CREATE_PERMISSIONS->value,
            PermissionEnum::UPDATE_PERMISSIONS->value,
            PermissionEnum::VIEW_ADMIN_DASHBOARD->value,
            PermissionEnum::VIEW_DASHBOARD->value,
            PermissionEnum::VIEW_PRODUCTS->value,
            PermissionEnum::VIEW_ORDERS->value,
        ]);

        $managerRole = Role::firstOrCreate(['name' => RoleEnum::ADMIN_APOTEK->value]);
        // Clear existing permissions for this role
        DB::table('role_has_permissions')
            ->where('role_id', $managerRole->id)
            ->delete();
        $managerRole->givePermissionTo([
            PermissionEnum::VIEW_ADMIN_DASHBOARD->value,
            PermissionEnum::VIEW_ORDERS->value,
            PermissionEnum::UPDATE_ORDERS->value,
            PermissionEnum::VIEW_PRODUCTS->value,
            PermissionEnum::VIEW_REPORTS->value,
            PermissionEnum::CREATE_REPORTS->value,
        ]);

        $userRole = Role::firstOrCreate(['name' => RoleEnum::USER->value]);
        // Clear existing permissions for this role
        DB::table('role_has_permissions')
            ->where('role_id', $userRole->id)
            ->delete();
        $userRole->givePermissionTo([
            PermissionEnum::VIEW_DASHBOARD->value,
        ]);
    }
}
