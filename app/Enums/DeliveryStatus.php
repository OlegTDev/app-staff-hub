<?php

declare(strict_types=1);

namespace App\Enums;

enum DeliveryStatus: string
{
    case PENDING = 'pending';
    case PUBLISHED = 'published';
    case FAILED = 'failed';

    public function label(): string
    {
        return match ($this) {
            self::PENDING => __('В очереди на передачу'),
            self::PUBLISHED => __('Передано в сервис отправки'),
            self::FAILED => __('Ошибка передачи'),
        };
    }
}
