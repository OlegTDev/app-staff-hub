<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class AdminUserSeeder extends Seeder
{
    /**
     * Создаёт пользователя admin с паролем secret и назначает ему роль admin.
     */
    public function run(): void
    {
        $adminRole = Role::query()->firstOrCreate(
            ['name' => UserRole::ADMIN->value],
            ['description' => UserRole::ADMIN->label()],
        );

        $admin = User::query()->firstOrCreate(
            ['login' => 'admin'],
            [
                'name' => 'Администратор',
                'email' => 'admin@example.com',
                'password' => 'secret',
                'domain' => 'local',
                'guid' => Str::uuid()->toString(),
                'email_verified_at' => now(),
            ],
        );

        // Гарантируем пароль secret и при повторном запуске сидера.
        $admin->forceFill(['password' => 'secret'])->save();

        $admin->roles()->syncWithoutDetaching([$adminRole->id]);
    }
}
