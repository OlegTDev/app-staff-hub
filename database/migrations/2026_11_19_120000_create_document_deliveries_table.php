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
        Schema::create('document_deliveries', function (Blueprint $table) {
            $table->id();
            $table->uuid('message_id')->unique();
            $table->foreignId('document_id')->constrained('documents')->cascadeOnDelete();
            $table->string('recipient', 100);
            $table->string('status', 20)->index();
            $table->unsignedTinyInteger('attempts')->default(0);
            $table->text('last_error')->nullable();
            $table->timestamp('published_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('document_deliveries');
    }
};
