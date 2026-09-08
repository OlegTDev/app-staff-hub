<?php

use App\Http\Controllers\UserController;

Route::middleware('roles:admin')->group(static function () {
    Route::resource('users', UserController::class)->except(['create', 'edit']);
});
