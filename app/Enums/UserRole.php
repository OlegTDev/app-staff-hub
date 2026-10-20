<?php

namespace App\Enums;

enum UserRole: string
{
    case ADMIN = 'admin';
    case SANATORIUM_MODERATOR = 'sanatorium_moderator';

    public function label(): string
    {
        return match ($this) {
            self::ADMIN => __('Администратор'),
            self::SANATORIUM_MODERATOR => __('Модератор санаториев'),
        };
    }
}
