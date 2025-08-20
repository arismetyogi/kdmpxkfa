<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class TestPermissions extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'test:permissions';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Test the permission system functionality';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $this->info('Testing Permission System...');

        // Check if roles and permissions exist
        $roles = Role::all();
        $permissions = Permission::all();

        $this->info("Found {$roles->count()} roles:");
        foreach ($roles as $role) {
            $this->line("  - {$role->name}");
        }

        $this->info("Found {$permissions->count()} permissions:");
        foreach ($permissions as $permission) {
            $this->line("  - {$permission->name}");
        }

        // Get the super admin user
        $user = User::where('email', 'super@admin.com')->first();
        if ($user) {
            $this->info("User found: {$user->name}");

            // Check user roles
            $userRoles = $user->roles;
            $this->info("User has {$userRoles->count()} roles:");
            foreach ($userRoles as $role) {
                $this->line("  - {$role->name}");
            }

            // Check user permissions
            $userPermissions = $user->permissions;
            $this->info("User has {$userPermissions->count()} direct permissions:");
            foreach ($userPermissions as $permission) {
                $this->line("  - {$permission->name}");
            }

            // Check if user can perform actions
            $this->info('Testing user permissions:');
            $this->line('  - Can view dashboard: '.($user->can('view dashboard') ? 'Yes' : 'No'));
            $this->line('  - Can view users: '.($user->can('view users') ? 'Yes' : 'No'));
            $this->line('  - Can create users: '.($user->can('create users') ? 'Yes' : 'No'));
            $this->line('  - Has admin role: '.($user->hasRole('admin') ? 'Yes' : 'No'));

            // Assign admin role if not already assigned
            if (! $user->hasRole('admin')) {
                $user->assignRole('admin');
                $this->info('Admin role assigned to user');
            } else {
                $this->info('User already has admin role');
            }
        } else {
            $this->error('Super admin user not found');

            return 1;
        }

        $this->info('Permission system test completed successfully!');

        return 0;
    }
}
