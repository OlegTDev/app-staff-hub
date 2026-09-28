<?php

use App\Http\Controllers\Dictionary\SanatoriumController;
use App\Http\Controllers\Dictionary\SanatoriumImageController;
use App\Http\Controllers\Dictionary\TormController;

Route::prefix('dictionary')->name('dictionary.')->group(static function() {

    // ТОРМ
    Route::resource('torms', TormController::class)->only(['index', 'store', 'update', 'destroy'])->middleware('roles:admin');

    Route::middleware('roles:admin,moderator-resort')->group(static function() {
        Route::resource('sanatoriums', SanatoriumController::class)->except('index', 'show');

        // Изображения санатория
        Route::get('/sanatoriums/{sanatorium}/images', [SanatoriumImageController::class, 'show'])->name('sanatoriums.images.show');
        Route::post('/sanatoriums/{sanatorium}/images', [SanatoriumImageController::class, 'store'])->name('sanatoriums.images.store');
        Route::delete('/sanatoriums/{sanatorium}/images', [SanatoriumImageController::class, 'destroy'])->name('sanatoriums.images.destroy');
        Route::delete('/sanatoriums/images-gallery/{sanatoriumPhoto}', [SanatoriumImageController::class, 'destroyGallery'])
            ->name('sanatoriums.images.destroy-gallery');
    });

    // Санатории
    Route::get('/sanatoriums', [SanatoriumController::class, 'index'])->name('sanatoriums.index');
    Route::get('/sanatoriums/{sanatorium}', [SanatoriumController::class, 'show'])->name('sanatoriums.show');

});
