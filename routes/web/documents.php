<?php

use App\Http\Controllers\DocumentGeneratePdfController;
use App\Http\Controllers\DocumentSanatoriumController;

Route::prefix('/documents')->group(function () {
    Route::get('/{document}/pdf', [DocumentGeneratePdfController::class, 'generate'])->name('documents.pdf');
    Route::post('/sanatoriums/pdf-preview', [DocumentGeneratePdfController::class, 'preview'])->name('documents.pdf-preview');
    Route::resource('sanatoriums', DocumentSanatoriumController::class)
        ->names('documents.sanatoriums')
        ->parameter('sanatoriums', 'documentSanatorium')
        ->except(['show']);
});
