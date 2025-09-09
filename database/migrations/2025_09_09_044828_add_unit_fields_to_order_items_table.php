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
            $table->integer('base_quantity')->nullable()->after('quantity');
            $table->string('order_unit')->nullable()->after('base_quantity');
            $table->string('base_uom')->nullable()->after('order_unit');
            $table->integer('content')->nullable()->after('base_uom');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('order_items', function (Blueprint $table) {
            $table->dropColumn(['base_quantity', 'order_unit', 'base_uom', 'content']);
        });
    }
};
