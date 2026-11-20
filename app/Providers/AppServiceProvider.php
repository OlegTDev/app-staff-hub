<?php

namespace App\Providers;

use App\Contracts\MessagePublisher;
use App\Models\Dictionary\Sanatorium;
use App\Observers\SanatoriumObserver;
use App\Services\Broker\RabbitMqPublisher;
use App\Services\ImageStorageService;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
        $this->app->bind(ImageStorageService::class, function($app) {
            $config = config('images.settings.default.thumb');

            return new ImageStorageService(
                width:  $config['width'],
                height: $config['height'],
                isPrivate: $config['is_private']
            );
        });

        $this->app->bind(MessagePublisher::class, static function (): MessagePublisher {
            $config = config('services.outbound_mail');
            $rabbitmq = $config['rabbitmq'];

            return new RabbitMqPublisher(
                host: $rabbitmq['host'],
                port: $rabbitmq['port'],
                user: $rabbitmq['user'],
                password: $rabbitmq['password'],
                vhost: $rabbitmq['vhost'],
                connectionTimeout: $rabbitmq['connection_timeout'],
                readWriteTimeout: $rabbitmq['read_write_timeout'],
            );
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        JsonResource::withoutWrapping();
        Sanatorium::observe(SanatoriumObserver::class);
    }
}
