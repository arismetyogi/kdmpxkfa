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
            BankAccountSeeder::class,
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
        $apotekAdmin = User::create([
            'uuid' => Str::uuid()->toString(),
            'name' => 'Apotek',
            'username' => 'apotek',
            'email' => 'apotek@admin.com',
            'email_verified_at' => now(),
            'password' => Hash::make('password'),
            'remember_token' => Str::random(10),
        ]);
        $busdevAdmin = User::create([
            'uuid' => Str::uuid()->toString(),
            'name' => 'Busdev',
            'username' => 'busdev',
            'email' => 'busdev@admin.com',
            'email_verified_at' => now(),
            'password' => Hash::make('password'),
            'remember_token' => Str::random(10),
        ]);

        // Assign admin role
        $superAdmin->assignRole(RoleEnum::SUPER_ADMIN->value);
        $apotekAdmin->assignRole(RoleEnum::ADMIN_APOTEK->value);
        $busdevAdmin->assignRole(RoleEnum::ADMIN_BUSDEV->value);
    }
}
