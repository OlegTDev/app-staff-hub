<?php

use App\Http\Controllers\RoleController;

Route::middleware('roles:admin')->group(static function () {
    Route::put('users/{user}/roles', [RoleController::class, 'update'])->name('users.roles.update');
});
