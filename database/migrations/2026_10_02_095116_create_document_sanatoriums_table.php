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
        Schema::create('document_sanatoriums', function (Blueprint $table) {
            $table->id();

            $table->string('to_organization');
            $table->string('to_manager_name');

            $table->foreignId('sanatorium_id')->constrained('sanatoriums')->cascadeOnDelete();
            $table->date('app_date');
            $table->string('user_name', 100);
            $table->string('user_organization', 200);
            $table->string('user_department', 100);
            $table->string('user_position', 100);
            $table->string('user_place', 50);
            $table->string('user_telephone_inner', 30);
            $table->string('user_telephone_outer', 30);
            $table->jsonb('user_relatives')->nullable();
            $table->date('vacation_start');
            $table->date('vacation_end');
            $table->boolean('any_date_during_vacation')->default(false);
            $table->date('arrival_date_from')->nullable();
            $table->date('arrival_date_to')->nullable();

            $table->string('status')->default('new');
        });

        Schema::create('document_sanatorium_additional', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sanatorium_id')->constrained('sanatoriums')->cascadeOnDelete();
            $table->foreignId('document_sanatorium_id')->constrained('document_sanatoriums')->cascadeOnUpdate();
            $table->integer('sort_order');

            $table->unique(['sanatorium_id', 'document_sanatorium_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('document_sanatorium_additional');
        Schema::dropIfExists('document_sanatoriums');
    }
};
