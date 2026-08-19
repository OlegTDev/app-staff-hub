<?php

namespace Tests\Unit;

use App\Models\User;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class UserTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_attributes_are_casted_correctly(): void
    {
        $user = User::factory()->create([
            'password' => 'my-secret-password',
            'email_verified_at' => '2026-08-19 10:00:00',
        ]);

        $this->assertNotEquals('my-secret-password', $user->password);
        $this->assertTrue(Hash::check('my-secret-password', $user->password));

        $this->assertInstanceOf(Carbon::class, $user->email_verified_at);
        $this->assertEquals(2026, $user->email_verified_at->year);
        $this->assertEquals(8, $user->email_verified_at->month);
    }

}
