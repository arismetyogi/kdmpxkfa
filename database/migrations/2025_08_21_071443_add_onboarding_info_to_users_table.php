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
        Schema::table('users', function (Blueprint $table) {
            $table->string('external_id')->nullable()->index(); // ID from origin app
            $table->boolean('onboarding_completed')->default(false);
            $table->string('tenant_id')->nullable()->index();
            $table->string('tenant_name')->nullable();
            $table->string('phone')->nullable();

            $table->index(['tenant_id', 'is_active']);
            $table->index(['external_id', 'is_active']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('external_id');
            $table->dropColumn('tenant_id');
            $table->dropColumn('tenant_name');
            $table->dropColumn('phone');
            $table->dropColumn('onboarding_completed');
            $table->dropIndex('users_external_id_index');
            $table->dropIndex('users_tenant_id_index');
        });
    }
};
