<?php

declare(strict_types=1);

namespace App\Contracts;

interface MessagePublisher
{
    /**
     * Публикует сообщение в брокер и дожидается подтверждения доставки.
     *
     * @param array<string, mixed> $payload
     */
    public function publish(string $exchange, string $routingKey, array $payload): void;
}
