<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Services\AuthService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AuthenticatedSessionController extends Controller
{
    /**
     * @route GET /login
     */
    public function create(): \Inertia\Response
    {
        return Inertia::render('Auth/Login');
    }

    public function store(LoginRequest $request, AuthService $authService): RedirectResponse
    {
        $request->authenticate($authService);
        return redirect()->intended('/');
    }

    public function destroy(Request $request): RedirectResponse
    {
        auth()->guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
