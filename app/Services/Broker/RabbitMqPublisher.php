<?php

declare(strict_types=1);

namespace App\Services\Broker;

use App\Contracts\MessagePublisher;
use JsonException;
use PhpAmqpLib\Channel\AMQPChannel;
use PhpAmqpLib\Connection\AMQPStreamConnection;
use PhpAmqpLib\Exception\AMQPExceptionInterface;
use PhpAmqpLib\Message\AMQPMessage;
use RuntimeException;

final class RabbitMqPublisher implements MessagePublisher
{
    private ?AMQPStreamConnection $connection = null;

    private ?AMQPChannel $channel = null;

    public function __construct(
        private readonly string $host,
        private readonly int $port,
        private readonly string $user,
        private readonly string $password,
        private readonly string $vhost,
        private readonly float $connectionTimeout,
        private readonly float $readWriteTimeout,
    ) {
    }

    /**
     * @param array<string, mixed> $payload
     */
    public function publish(string $exchange, string $routingKey, array $payload): void
    {
        try {
            $body = json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR);
            $channel = $this->channel();

            $message = new AMQPMessage($body, [
                'delivery_mode' => AMQPMessage::DELIVERY_MODE_PERSISTENT,
                'content_type' => 'application/json',
                'content_encoding' => 'UTF-8',
                'message_id' => (string) ($payload['message_id'] ?? ''),
            ]);

            $channel->basic_publish($message, $exchange, $routingKey, true);
            $channel->wait_for_pending_acks();
        } catch (JsonException|AMQPExceptionInterface $exception) {
            throw new RuntimeException($exception->getMessage(), 0, $exception);
        }
    }

    private function channel(): AMQPChannel
    {
        if ($this->channel !== null) {
            return $this->channel;
        }

        $this->connection = new AMQPStreamConnection(
            $this->host,
            $this->port,
            $this->user,
            $this->password,
            $this->vhost,
            false,
            'AMQPLAIN',
            null,
            'en_US',
            $this->connectionTimeout,
            $this->readWriteTimeout,
        );

        $channel = $this->connection->channel();
        $channel->confirm_select();
        $channel->set_return_listener(
            static function (int $replyCode, string $replyText, string $exchange, string $routingKey): void {
                throw new RuntimeException(sprintf(
                    'Сообщение не доставлено в очередь (exchange "%s", routing key "%s"): %s [%d]',
                    $exchange,
                    $routingKey,
                    $replyText,
                    $replyCode,
                ));
            },
        );

        return $this->channel = $channel;
    }

    public function __destruct()
    {
        try {
            $this->channel?->close();
            $this->connection?->close();
        } catch (AMQPExceptionInterface) {
            // Соединение уже закрыто — закрывать нечего.
        }
    }
}
