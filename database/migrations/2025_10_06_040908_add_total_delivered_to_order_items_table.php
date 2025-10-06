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
        Schema::table('order_items', function (Blueprint $table) {
            $table->decimal('net_delivered', 10)->after('total_price')->nullable();
            $table->decimal('tax_delivered')->after('net_delivered')->nullable();
            $table->integer('total_delivered')->after('tax_delivered')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('order_items', function (Blueprint $table) {
            $table->dropColumn('net_delivered');
            $table->dropColumn('tax_delivered');
            $table->dropColumn('total_delivered');
        });
    }
};
