<?php

namespace App\Providers;

use App\Services\ImageUploadService;
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
        $this->app->bind(ImageUploadService::class, function($app) {
            $config = config('images.settings.default.thumb');

            return new ImageUploadService(
                width:  $config['width'],
                height: $config['height'],
                isPrivate: $config['is_private']
            );
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        JsonResource::withoutWrapping();
    }
}
