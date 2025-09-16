<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class OrderProductSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('order_items')->insert([
            [
                'order_id'   => 1,   // ID order dari OrderSeeder
                'product_id' => 1,   // Pastikan ada produk dengan ID ini
                'quantity'   => 2,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'order_id'   => 1,
                'product_id' => 2,
                'quantity'   => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'order_id'   => 2,
                'product_id' => 1,
                'quantity'   => 3,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'order_id'   => 2,
                'product_id' => 3,
                'quantity'   => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
