<?php

use App\Http\Controllers\SanatoriumApplicationController;
use App\Http\Controllers\SanatoriumApplicationPdfController;

Route::get('/sanatoriums-applications/{sanatoriumApplication}/pdf', [SanatoriumApplicationPdfController::class, 'generatePdf'])
    ->name('sanatoriums.applications.generatePdf');

Route::prefix('sanatoriums')->name('sanatoriums.')->group(function () {
    Route::resource('applications', SanatoriumApplicationController::class);
});

