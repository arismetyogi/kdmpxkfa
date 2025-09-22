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
            // Tambah status approval user
            $table->string('status')
                ->default('pending')
                ->after('password');


            $table->unsignedBigInteger('approved_by')
                ->nullable()
                ->after('status');

            // Tambah kolom waktu di-approve
            $table->timestamp('approved_at')
                ->nullable()
                ->after('approved_by');
        });
    }

    /**
     * Reverse the migrations.
     */
  public function down(): void
{
    Schema::table('users', function (Blueprint $table) {
        if (Schema::hasColumn('users', 'status')) {
            $table->dropColumn('status');
        }
        if (Schema::hasColumn('users', 'approved_by')) {
            $table->dropColumn('approved_by');
        }
        if (Schema::hasColumn('users', 'approved_at')) {
            $table->dropColumn('approved_at');
        }
    });
}
};
