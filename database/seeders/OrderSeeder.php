<?php

    namespace Database\Seeders;

    use Illuminate\Database\Seeder;
    use App\Models\Order;
    use App\Models\User;
    use Illuminate\Support\Str;

    class OrderSeeder extends Seeder
    {
        /**
         * Run the database seeds.
         */
        public function run(): void
        {
            $user = User::first() ?? User::factory()->create();

            Order::create([
                // Order Info
                'transaction_number' => 'TRX-' . strtoupper(Str::random(8)),
                'user_id'            => $user->id,
                'tenant_id'          => 'TNT-001',

                // Status
                'status'             => 'On Delivery',

                // Payment
                'source_of_fund'     => 'pinjaman',
                'account_no'         => '1234567890',
                'account_bank'       => 'BRI',
                'payment_type'       => 'cad',
                'payment_method'     => 'bri',
                'va_number'          => '9876543210',

                // Pricing
                'subtotal'           => 500000,
                'tax_amount'         => 55000,
                'shipping_amount'    => 20000,
                'discount_amount'    => 0,
                'total_price'        => 575000,

                // Billing
                'billing_name'       => 'John Doe',
                'billing_email'      => 'johndoe@example.com',
                'billing_phone'      => '08123456789',
                'billing_address'    => 'Jl. Merdeka No. 123',
                'billing_city'       => 'Jakarta',
                'billing_state'      => 'DKI Jakarta',
                'billing_zip'        => '10110',

                // Shipping
                'shipping_name'      => 'John Doe',
                'shipping_address'   => 'Jl. Merdeka No. 123',
                'shipping_city'      => 'Jakarta',
                'shipping_state'     => 'DKI Jakarta',
                'shipping_zip'       => '10110',

                // Shipping Details
                'shipping_method'    => 'standard',
                'tracking_number'    => 'TRK123456',
                'estimated_delivery' => now()->addDays(3),
                'shipped_at'         => null,
                'delivered_at'       => null,

                // Notes
                'customer_notes'     => 'Tolong kirim di jam kerja.',
                'admin_notes'        => 'Pesanan masih diproses.',
            ]);

            Order::create([
                'transaction_number' => 'TRX-' . strtoupper(Str::random(8)),
                'user_id'            => $user->id,
                'tenant_id'          => 'TNT-002',
                'status'             => 'Process',
                'source_of_fund'     => 'pribadi',
                'account_no'         => '2233445566',
                'account_bank'       => 'Mandiri',
                'payment_type'       => 'cad',
                'payment_method'     => 'mandiri',
                'va_number'          => '1234509876',
                'subtotal'           => 200000,
                'tax_amount'         => 20000,
                'shipping_amount'    => 15000,
                'discount_amount'    => 5000,
                'total_price'        => 230000,
                'billing_name'       => 'Jane Smith',
                'billing_email'      => 'janesmith@example.com',
                'billing_phone'      => '08129876543',
                'billing_address'    => 'Jl. Sudirman No. 45',
                'billing_city'       => 'Bandung',
                'billing_state'      => 'Jawa Barat',
                'billing_zip'        => '40123',
                'shipping_name'      => 'Jane Smith',
                'shipping_address'   => 'Jl. Sudirman No. 45',
                'shipping_city'      => 'Bandung',
                'shipping_state'     => 'Jawa Barat',
                'shipping_zip'       => '40123',
                'shipping_method'    => 'express',
                'tracking_number'    => 'TRK654321',
                'estimated_delivery' => now()->addDays(2),
                'shipped_at'         => null,
                'delivered_at'       => null,
                'customer_notes'     => 'Mohon bungkus rapi.',
                'admin_notes'        => 'Pesanan dalam proses pengiriman.',
            ]);

            Order::create([
                'transaction_number' => 'TRX-' . strtoupper(Str::random(8)),
                'user_id'            => $user->id,
                'tenant_id'          => 'TNT-003',
                'status'             => 'On Delivery',
                'source_of_fund'     => 'pribadi',
                'account_no'         => '2233445566',
                'account_bank'       => 'Mandiri',
                'payment_type'       => 'cad',
                'payment_method'     => 'mandiri',
                'va_number'          => '1234509876',
                'subtotal'           => 200000,
                'tax_amount'         => 20000,
                'shipping_amount'    => 15000,
                'discount_amount'    => 5000,
                'total_price'        => 230000,
                'billing_name'       => 'Jane Smith',
                'billing_email'      => 'janesmith@example.com',
                'billing_phone'      => '08129876543',
                'billing_address'    => 'Jl. Sudirman No. 45',
                'billing_city'       => 'Bandung',
                'billing_state'      => 'Jawa Barat',
                'billing_zip'        => '40123',
                'shipping_name'      => 'Jane Smith',
                'shipping_address'   => 'Jl. Sudirman No. 45',
                'shipping_city'      => 'Bandung',
                'shipping_state'     => 'Jawa Barat',
                'shipping_zip'       => '40123',
                'shipping_method'    => 'express',
                'tracking_number'    => 'TRK654321',
                'estimated_delivery' => now()->addDays(2),
                'shipped_at'         => null,
                'delivered_at'       => null,
                'customer_notes'     => 'Mohon bungkus rapi.',
                'admin_notes'        => 'Pesanan dalam proses pengiriman.',
            ]);
        }

    }
