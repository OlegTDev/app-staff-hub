<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use App\Services\AuthService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class LoginTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        RateLimiter::clear(Str::lower('json') . '|127.0.0.1');
    }

    public function test_user_can_authenticate_with_valid_credentials(): void
    {
        config(['auth.providers.users.driver' => 'eloquent']);

        $user = User::factory()->make(['name' => 'josh']);

        $this->mock(AuthService::class, function ($mock) use ($user) {
            $mock->shouldReceive('attemptLogin')
                ->once()
                ->with('eloquent', 'josh', 'password', true)
                ->andReturn(true);
        });

        $response = $this->post('/login', [
            'username' => 'josh',
            'password' => 'password',
        ]);

        $response->assertRedirect('/');
    }

    public function test_login_attempts_are_throttled_after_5_failures(): void
    {
        $this->mock(AuthService::class, function($mock) {
            $mock->shouldReceive('attemptLogin')->andReturn(false);
        });

        for($i = 0; $i < 5; $i++) {
            $this->post('/login', [
                'username' => 'josh',
                'password' => 'wrong-password',
            ]);
        }

        $response = $this->post('/login', [
            'username' => 'josh',
            'password' => 'wrong-password',
        ]);

        $response->assertSessionHasErrors('username');
        $this->assertStringContainsString(
            trans('auth.throttle', ['seconds' => 60, 'minutes' => 1]),
            session('errors')->get('username')[0]
        );
    }

    public function test_login_screen_can_be_rendered(): void
    {
        $response = $this->get('/login');

        $response->assertStatus(200);

        $response->assertInertia(fn (Assert $page) => $page
            ->component('Auth/Login')
        );
    }

    public function test_user_can_logout(): void
    {
        $user = User::factory()->make();

        $response = $this
            ->actingAs($user)
            ->delete('/logout');

        $response->assertRedirect('/');

        $this->assertGuest();
    }
}
