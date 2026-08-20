<?php

namespace Tests\Unit;

use App\Models\Role;
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

    public function test_it_roles(): void
    {
        /** @var Role[] */
        [$role1,,,$role2,] = Role::factory()->count(5)->create();

        $user = User::factory()->create();
        $user->roles()->attach([$role1->id, $role2->id]);

        $this->assertCount(2, $user->roles);
        $this->assertTrue($role1->is($user->roles->first()));
        $this->assertTrue($role2->is($user->roles->last()));
    }

    public function test_scope_filter_searches_by_name_and_login_case_insensitive(): void
    {
        User::factory()->create(['name' => 'Иван Иванов', 'login' => 'ivanov_i']);
        User::factory()->create(['name' => 'Петр Петров', 'login' => 'petrov_p']);
        User::factory()->create(['name' => 'Сидор Сидоров', 'login' => 'sidor_s']);

        $results = User::query()->filter(['search' => 'Иван'])->get();
        $this->assertCount(1, $results);
        $this->assertEquals('ivanov_i', $results->first()->login);

        $resultsByLogin = User::query()->filter(['search' => 'petr'])->get();

        $this->assertCount(1, $resultsByLogin);
        $this->assertEquals('Петр Петров', $resultsByLogin->first()->name);
    }

}
