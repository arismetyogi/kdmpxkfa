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
        Schema::create('sso_sessions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('session_token', 64)->unique();
            $table->string('origin_app', 50);
            $table->timestamp('expires_at');
            $table->json('metadata')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'origin_app']);
            $table->index(['session_token', 'expires_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sso_sessions');
    }
};
