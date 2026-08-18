<?php

namespace App\Services;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class AuthService
{
    public function attemptLogin(string $authDriver, string $username, string $password, bool $remember = true): bool
    {
        if ($authDriver === 'ldap') {
            $samaccountname = Str::of($username)->after('\\')->before('@')->toString();

            return Auth::attempt([
                'samaccountname' => $samaccountname,
                'password' => $password,
            ], $remember);
        }

        return Auth::attempt([
            'login' => $username,
            'password' => $password
        ], $remember);
    }
}
