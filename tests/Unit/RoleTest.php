<?php

namespace Tests\Unit;

use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RoleTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_get_users_by_relations(): void
    {
        /** @var User[] */
        [$user1,,,$user2,] = User::factory()->count(5)->create();

        $role = Role::factory()->create();
        $role->users()->attach([$user1->id, $user2->id]);

        $this->assertCount(2, $role->users);
        $this->assertTrue($user1->is($role->users->first()));
        $this->assertTrue($user2->is($role->users->last()));
    }

}
