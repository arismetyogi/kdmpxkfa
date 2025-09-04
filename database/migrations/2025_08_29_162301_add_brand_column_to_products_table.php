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
        Schema::table('products', function (Blueprint $table) {
            $table->string('brand')->nullable();
            $table->text('description')->nullable();
            $table->json('dosage')->nullable();
            $table->text('pharmacology')->nullable();
            $table->string('base_uom');
            $table->string('order_unit');
            $table->integer('content');

            $table->unique(['sku', 'brand']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn('brand');
            $table->dropColumn('description');
            $table->dropColumn('dosage');
            $table->dropColumn('pharmacology');
            $table->dropColumn('base_uom');
            $table->dropColumn('order_unit');
            $table->dropColumn('content');
            $table->dropColumn('image_alt');

            $table->dropUnique(['sku', 'brand']);
        });
    }
};
