<?php

use App\Http\Controllers\DocumentController;
use App\Http\Controllers\DocumentGeneratePdfController;
use App\Http\Controllers\DocumentSanatoriumController;

Route::get('/documents', [DocumentController::class, 'index'])->name('documents.index');
Route::prefix('/documents')->group(function () {
    Route::get('/{document}/pdf', [DocumentGeneratePdfController::class, 'generate'])->name('documents.pdf');
    Route::resource('sanatoriums', DocumentSanatoriumController::class)
        ->names('documents.sanatoriums')
        ->parameter('sanatoriums', 'documentSanatorium');
});
