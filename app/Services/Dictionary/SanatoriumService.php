<?php

namespace App\Services\Dictionary;

use App\Models\Dictionary\Sanatorium;
use App\Services\ImageUploadService;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\DB;

class SanatoriumService
{

    public function createSanatorium(FormRequest $request): void
    {
        $imageUploadService = app()->make(ImageUploadService::class);
        DB::transaction(static function () use ($request, $imageUploadService) {
            $sanatorium = Sanatorium::create($request->validated());

            if ($request->hasFile('images')) {
                $storagePaths = $imageUploadService->uploadMultiple(
                    uploadImages: $request->file('images'),
                    folder: "sanatoriums/{$sanatorium->id}",
                    withThumb: true,
                );

                foreach ($storagePaths as $storagePath) {
                    $sanatorium->photos()->create([
                        'type' => 'gallery',
                        'photo_file' => $storagePath['image'],
                        'thumb_file' => $storagePath['thumb'],
                    ]);
                }
            }
        });
    }

}
