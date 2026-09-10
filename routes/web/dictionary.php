<?php

use App\Http\Controllers\Dictionary\SanatoriumController;
use App\Http\Controllers\Dictionary\TormController;

Route::prefix('dictionary')->name('dictionary.')->group(static function() {

    // ТОРМ
    Route::resource('torms', TormController::class)->only(['index', 'store', 'update', 'remove'])->middleware('roles:admin');

    // Санатории
    Route::resource('sanatoriums', SanatoriumController::class)->middleware('roles:admin,moderator-resort');

});
