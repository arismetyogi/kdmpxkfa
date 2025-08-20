<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Call the role and permission seeder first
        $this->call([
            RoleAndPermissionSeeder::class,
        ]);

        // Create super admin user
        $superAdmin = User::factory()->create([
            'name' => 'Super Admin',
            'username' => 'super',
            'email' => 'super@admin.com',
        ]);

        // Assign admin role to super admin
        $superAdmin->assignRole('admin');
    }
}
