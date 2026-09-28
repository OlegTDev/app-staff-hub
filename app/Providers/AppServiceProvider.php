<?php

namespace App\Providers;

use App\Models\Dictionary\Sanatorium;
use App\Observers\SanatoriumObserver;
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
