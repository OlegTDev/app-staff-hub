<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


require __DIR__ . '/web/auth.php';

Route::middleware('auth')->group(function() {
    Route::get('/', function () {
        return Inertia::render('Welcome');
    });

    require __DIR__ . '/web/users.php';
});


