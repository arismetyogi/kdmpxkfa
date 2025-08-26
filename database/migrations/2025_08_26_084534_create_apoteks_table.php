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
        Schema::create('apoteks', function (Blueprint $table) {
            $table->id();
            $table->string('branch');
            $table->string('sap_id');
            $table->string('name');
            $table->string('address')->nullable();
            $table->string('phone')->nullable();
            $table->float('latitude')->nullable();
            $table->float('longitude')->nullable();
            $table->string('zipcode')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('apoteks');
    }
};
