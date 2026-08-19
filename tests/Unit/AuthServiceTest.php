<?php

namespace Tests\Unit;

use App\Services\AuthService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Auth;
use Tests\TestCase;

class AuthServiceTest extends TestCase
{
    use RefreshDatabase;

    private AuthService $service;

    public function setUp() :void
    {
        parent::setUp();
        $this->service = app()->make(AuthService::class);
    }

    public function test_it_attempt_by_ldap(): void
    {
        $username = 'josh';
        $password = 'password';
        $remember = false;

        Auth::shouldReceive('attempt')
            ->once()
            ->with([
                'samaccountname' => $username,
                'password' => $password,
            ], $remember)
            ->andReturn(true);

        $result = $this->service->attemptLogin('ldap', $username, $password, $remember);
        $this->assertTrue($result);
    }

    public function test_it_attempt_by_eloquent(): void
    {
        $username = 'josh';
        $password = 'password';
        $remember = true;

        Auth::shouldReceive('attempt')
            ->once()
            ->with([
                'login' => $username,
                'password' => $password,
            ], $remember)
            ->andReturn(true);

        $result = $this->service->attemptLogin('eloquent', $username, $password, $remember);
        $this->assertTrue($result);
    }

}
