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
        Schema::create('koperasi_master', function (Blueprint $table) {
            $table->id();
            $table->string('name')->nullable();
            $table->string('village');
            $table->string('district');
            $table->string('city');
            $table->string('province');
            $table->string('status');
            $table->string('area');
            $table->timestamps();

            $table->index(['village', 'district'], 'village_index');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('koperasi_master');
    }
};
