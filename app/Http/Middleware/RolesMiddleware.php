<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RolesMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        /** @var \App\Models\User */
        $user = $request->user();

        if (collect($roles)->contains(fn(string $role) => $user->hasRole($role))) {
            return $next($request);
        }

        abort(403);
    }
}
