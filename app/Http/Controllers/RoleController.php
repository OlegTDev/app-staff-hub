<?php

namespace App\Http\Controllers;

use App\Http\Requests\RoleRequest;
use App\Models\User;

class RoleController extends Controller
{
    public function update(User $user, RoleRequest $request)
    {
        $roles = $request->validated('roles', []);
        $user->roles()->sync($roles);

        return back()->with('success', 'Роли изменены');
    }
}
