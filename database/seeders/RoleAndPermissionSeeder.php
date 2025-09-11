<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
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

        // Create permissions
        $permissions = [
            'view users',
            'create users',
            'update users',
            'delete users',
            'view roles',
            'create roles',
            'update roles',
            'delete roles',
            'view permissions',
            'create permissions',
            'update permissions',
            'delete permissions',
            'view dashboard',
            'view admin dashboard',
            'view products',
            'create products',
            'update products',
            'delete products',
            'view orders',
            'create orders',
            'update orders',
            'delete orders',
            'view reports',
            'create reports',
        ];

        foreach ($permissions as $permission) {
            Permission::create(['name' => $permission]);
        }

        // Create roles and assign permissions
        $superAdminRole = Role::create(['name' => 'super-admin']);
        $superAdminRole->givePermissionTo(Permission::all());

        $adminRole = Role::create(['name' => 'admin']);
        $adminRole->givePermissionTo([
            'view users',
            'create users',
            'update users',
            'view roles',
            'create roles',
            'update roles',
            'view permissions',
            'create permissions',
            'update permissions',
            'view admin dashboard',
            'view dashboard',
            'view products',
            'view orders',
        ]);

        $managerRole = Role::create(['name' => 'admin-apotek']);
        $managerRole->givePermissionTo([
            'view admin dashboard',
            'view orders',
            'update orders',
            'view products',
            'view reports',
            'create reports',
        ]);

        $userRole = Role::create(['name' => 'user']);
        $userRole->givePermissionTo([
            'view dashboard',
        ]);
    }
}
