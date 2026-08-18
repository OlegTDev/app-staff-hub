<?php

use App\Http\Controllers\AuthenticatedSessionController;


Route::get('/login', [AuthenticatedSessionController::class, 'create'])
    ->name('login')
    ->middleware('guest');

Route::post('/login', [AuthenticatedSessionController::class, 'store'])
    ->name('login.store');

Route::delete('/logout', [AuthenticatedSessionController::class, 'destroy'])
    ->name('logout.custom')
    ->middleware('auth');
