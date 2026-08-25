<?php

namespace App\Console\Commands;

use App\Models\Role;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;

#[Signature('role:create {name} {description?}')]
#[Description('Создание роли')]
class CreateRole extends Command
{
    /**
     * Execute the console command.
     */
    public function handle()
    {
        $name = $this->argument('name');
        $description = $this->argument('description');

        if (Role::where('name', $name)->exists()) {
            $this->fail("Роль с именем {$name} уже существует");
        }

        Role::create(['name' => $name, 'description' => $description]);
        $this->info("Роль $name успешно создана!");
        return self::SUCCESS;
    }
}
