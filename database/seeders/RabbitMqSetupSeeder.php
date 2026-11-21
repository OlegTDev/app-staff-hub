<?php

declare(strict_types=1);

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use PhpAmqpLib\Connection\AMQPStreamConnection;
use PhpAmqpLib\Message\AMQPMessage;

class RabbitMqSetupSeeder extends Seeder
{
    public function run(): void
    {
        $host = env('RABBITMQ_HOST', 'localhost');
        $port = env('RABBITMQ_PORT', 5672);
        $user = env('RABBITMQ_USER', 'guest');
        $pass = env('RABBITMQ_PASSWORD', 'guest');
        $vhost = env('RABBITMQ_VHOST', '/');

        $exchange = 'mail';
        $queue = 'mail';
        $routingKey = 'mail.send';

        $connection = new AMQPStreamConnection($host, $port, $user, $pass, $vhost);
        $channel = $connection->channel();

        // Создаём exchange
        $channel->exchange_declare($exchange, 'topic', false, true, false);

        // Создаём queue
        $channel->queue_declare($queue, false, true, false, false);

        // Биндим queue к exchange
        $channel->queue_bind($queue, $exchange, $routingKey);

        $channel->close();
        $connection->close();

        $this->command->info('RabbitMQ exchange, queue and binding created successfully.');
    }
}
