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
        Schema::create('user_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('name');
            $table->string('tenant_id');
            $table->string('tenant_name');
            $table->string('source_app');
            $table->string('province_code');
            $table->string('city_code');
            $table->string('district_code');
            $table->string('village_code');
            $table->string('address')->nullable();
            $table->string('zipcode')->nullable();
            $table->decimal('latitude', 15, 8)->default(0.0);
            $table->decimal('longitude', 15, 8)->default(0.0);
            $table->string('nik')->nullable();
            $table->string('pic_name')->nullable();
            $table->string('pic_phone')->nullable();
            $table->string('nib_number')->nullable();
            $table->json('bank_account')->nullable();
            $table->string('npwp')->nullable();
            $table->string('sk_number')->nullable();
            $table->string('nib_file')->nullable();
            $table->string('ktp_file')->nullable();
            $table->string('npwp_file')->nullable();
            $table->string('sia_number')->nullable();
            $table->timestamps();

            $table->foreign('province_code')->references('code')->on('regions');
            $table->foreign('city_code')->references('code')->on('regions');
            $table->foreign('district_code')->references('code')->on('regions');
            $table->foreign('village_code')->references('code')->on('regions');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_profiles');
    }
};
