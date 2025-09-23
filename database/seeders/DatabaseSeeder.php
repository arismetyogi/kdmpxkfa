<?php

namespace Database\Seeders;

use App\Enums\RoleEnum;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            RoleAndPermissionSeeder::class,
            ProductSeeder::class,
            ApotekSeeder::class,
            RegionSeeder::class,
            OrderSeeder::class,
            OrderProductSeeder::class,
        ]);

        $superAdmin = User::create([
            'uuid' => Str::uuid()->toString(),
            'name' => 'Super Admin',
            'username' => 'super',
            'email' => 'super@admin.com',
            'email_verified_at' => now(),
            'password' => Hash::make('password'),
            'remember_token' => Str::random(10),
        ]);

        // Assign admin role
        $superAdmin->assignRole(RoleEnum::SUPER_ADMIN->value);
    }
}
