<?php

use App\Http\Controllers\SanatoriumApplicationController;

Route::prefix('sanatoriums')->name('sanatoriums.')->group(function () {
    Route::resource('applications', SanatoriumApplicationController::class);
});
