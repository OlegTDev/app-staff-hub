<?php

namespace App\Console\Commands;

use App\Models\Role;
use App\Models\User;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;

#[Signature('user:assign-role {login} {role}')]
#[Description('Предоставление роли пользователю. ')]
class UserAssignRole extends Command
{
    /**
     * Execute the console command.
     */
    public function handle()
    {
        $login = $this->argument('login');
        $role = $this->argument('role');

        $userModel = User::where('login', $login)->first();
        if ($userModel === null) {
            $this->fail("Пользователь $login не найден!");
        }
        $roleModel = Role::where('name', $role)->first();
        if ($roleModel === null) {
            $this->fail("Роль $role не найдена!");
        }

        if ($userModel->roles()->where('name', $role)->exists()) {
            $this->fail("Роль уже назначена!");
        }

        $userModel->roles()->attach([$roleModel->id]);
        $this->info(\sprintf("Роль $role назначена пользователю %s с логином %s", $userModel->name, $login));
    }
}
