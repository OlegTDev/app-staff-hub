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
        Schema::create('sanatoriums', function (Blueprint $table) {
            $table->id();
            $table->string('name', 200);
            $table->string('city', 100);
            $table->string('address', 300)->nullable();
            $table->json('infrastructure')->default('[]');
            $table->json('services')->default('[]');
            $table->json('medical_profiles')->default('[]');
            $table->text('description')->nullable();

            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('sanatorium_photos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sanatorium_id')->constrained('sanatoriums')->cascadeOnDelete();
            $table->string('type');
            $table->string('photo_file', 250);
            $table->string('thumb_file', 250);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sanatorium_photos');
        Schema::dropIfExists('sanatoriums');
    }
};
