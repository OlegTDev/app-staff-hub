<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Role::factory()->createMany([
            ['name' => 'admin', 'description' => 'Администратор'],
            ['name' => 'moderator-resort', 'description' => 'Модератор заявлений на санаторно-курортное лечение'],
        ]);
    }
}
