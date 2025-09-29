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
        Schema::create('cooperation_submissions', function (Blueprint $table) {
            $table->id();
            $table->string('submission_number')->unique();
            $table->unsignedBigInteger('koperasi_id')->constrained('koperasi_master', 'id');
            $table->string('name');
            $table->string('province');
            $table->string('city');
            $table->string('district');
            $table->string('village');
            $table->string('gmap_url');
            $table->string('status')->default('submitted'); // submitted, approved_by_bm, approved_by_busdev, rejected
            $table->string('bm_comment')->nullable();
            $table->string('proposal_letter');
            $table->string('self_assessment');
            $table->string('indoor_photo');
            $table->string('outdoor_photo');
            $table->string('pharmacist_statement_letter');
            $table->string('video_360');
            $table->string('admin_comment')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cooperation_submissions');
    }
};
