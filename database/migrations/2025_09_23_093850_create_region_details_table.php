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
        Schema::create('region_details', function (Blueprint $table) {
            $table->id();
            $table->string('code');
            $table->string('name');
            $table->string('capital');
            $table->decimal('latitude', 15, 8);
            $table->decimal('longitude', 15, 8);
            $table->decimal('elevation', 15, 8);
            $table->decimal('area', 15, 8)->nullable();
            $table->integer('population')->default(0);
            $table->integer('timezone')->nullable();
            $table->longText('path')->nullable();
            $table->timestamps();

            $table->foreign('code')->references('code')->on('regions');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('region_details');
    }
};
