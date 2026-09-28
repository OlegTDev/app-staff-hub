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
        Schema::create('sanatoriums_applications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('sanatorium_id')->constrained('sanatoriums')->cascadeOnDelete();

            $table->date('app_date');
            $table->string('user_name');
            $table->string('user_department');
            $table->string('user_position');
            $table->string('user_place');
            $table->string('user_telephone_inner');
            $table->string('user_telephone_outer');
            $table->jsonb('user_relatives')->nullable();

            $table->date('vacation_start');
            $table->date('vacation_end');
            $table->boolean('any_date_during_vacation')->default(false);
            $table->date('arrival_date_from')->nullable();
            $table->date('arrival_date_to')->nullable();

            $table->string('status')->default('new');

            $table->timestamps();
        });

        Schema::create('sanatoriums_applications_additional', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sanatorium_id')->constrained('sanatoriums')->cascadeOnDelete();
            $table->foreignId('sanatorium_application_id')->constrained('sanatoriums_applications')->cascadeOnUpdate();
            $table->integer('sort_order');

            $table->unique(['sanatorium_id', 'sanatorium_application_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sanatoriums_applications_additional');
        Schema::dropIfExists('sanatoriums_applications');
    }
};
