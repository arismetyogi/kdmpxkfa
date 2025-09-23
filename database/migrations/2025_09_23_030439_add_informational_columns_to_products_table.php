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
            $table->string('dosage_form')->nullable()->after('content');
            $table->json('active_ingredients')->nullable()->after('dosage_form');
            $table->text('usage_direction')->nullable();
            $table->text('contraindication')->nullable();
            $table->text('adverse_effects')->nullable();
            $table->text('caution')->nullable();
            $table->string('storage')->nullable();
            $table->string('registration_number')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn('dosage_form');
            $table->dropColumn('active_ingredients');
            $table->dropColumn('usage_direction');
            $table->dropColumn('contraindication');
            $table->dropColumn('adverse_effects');
            $table->dropColumn('caution');
            $table->dropColumn('storage');
            $table->dropColumn('registration_number');
        });
    }
};
