<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            // Order Information
            $table->string('transaction_number')->unique()->index();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('tenant_id');

            // Order Status
            $table->string('status')->default('pending');

            // Payment Information
            $table->string('source_of_fund')->default('pinjaman'); // pinjaman, pribadi
            $table->string('account_no'); // no rek opr kdkmp
            $table->string('account_bank'); // nama bank rek opr kdkmp
            $table->string('payment_type')->default('cad');
            $table->string('payment_method'); // bri, bni, mandiri, bsi, btn, bca

            $table->string('va_number'); // merchant (KF)'s va account/account

            // Pricing
            $table->decimal('subtotal', 20, 2)->default(0);
            $table->decimal('tax_amount', 20, 2)->default(0);
            $table->decimal('shipping_amount', 20, 2)->default(0);
            $table->decimal('discount_amount', 20, 2)->default(0);
            $table->decimal('total_price', 20, 2)->default(0);

            // Billing Information
            $table->string('billing_name');
            $table->string('billing_email');
            $table->string('billing_phone')->nullable();
            $table->text('billing_address');
            $table->string('billing_city');
            $table->string('billing_state');
            $table->string('billing_zip');

            // Shipping Information
            $table->string('shipping_name')->nullable();
            $table->text('shipping_address')->nullable();
            $table->string('shipping_city')->nullable();
            $table->string('shipping_state')->nullable();
            $table->string('shipping_zip')->nullable();

            // Shipping Details
            $table->string('shipping_method')->default('standard');
            $table->string('tracking_number')->nullable();
            $table->date('estimated_delivery')->nullable();
            $table->date('shipped_at')->nullable();
            $table->date('delivered_at')->nullable();

            // Order Notes
            $table->text('customer_notes')->nullable();
            $table->text('admin_notes')->nullable();
            $table->timestamps();

            // Indexes
            $table->index(['user_id', 'status']);
            $table->index(['transaction_number']);
            $table->index(['payment_status']);
            $table->index(['created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
