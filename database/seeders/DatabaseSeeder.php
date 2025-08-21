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
        $this->call([
            RoleAndPermissionSeeder::class,
        ]);

        $superAdmin = User::factory()->create([
            'name' => 'Super Admin',
            'username' => 'super',
            'email' => 'super@admin.com',
        ]);

        // Assign admin role
        $superAdmin->assignRole('super-admin');
    }
}
