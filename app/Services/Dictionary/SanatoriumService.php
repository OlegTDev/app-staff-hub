<?php

namespace App\Services\Dictionary;

use App\Models\Dictionary\Sanatorium;
use App\Models\Dictionary\SanatoriumPhoto;
use App\Services\ImageStorageService;
use Illuminate\Http\UploadedFile;

class SanatoriumService
{
    public function __construct(private ImageStorageService $imageStorageService)
    {}

    public function createSanatorium(array $validated): Sanatorium
    {
        return Sanatorium::create($validated);
    }

    public function uploadGeneralPhoto(UploadedFile $photo, Sanatorium $sanatorium): void
    {
        $storagePath = $this->imageStorageService->upload(
            uploadImage: $photo,
            folder: "sanatoriums/{$sanatorium->id}",
            width: 800,
            height: 800,
        );

        if ($sanatorium->photo_thumbnail) {
            $this->imageStorageService->deleteImage($sanatorium->photo_thumbnail);
        }

        $sanatorium->photo_thumbnail = $storagePath['image'];
        $sanatorium->save();
    }

    public function uploadGalleryPhotos(array $images, Sanatorium $sanatorium): void
    {
        $storagePaths = $this->imageStorageService->uploadMultiple(
            uploadImages: $images,
            folder: $this->getSanatoriumUploadFolder($sanatorium),
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

    public function deleteGeneralPhoto(Sanatorium $sanatorium): void
    {
        if ($sanatorium->photo_thumbnail) {
            $this->imageStorageService->deleteImage($sanatorium->photo_thumbnail);

            $sanatorium->photo_thumbnail = null;
            $sanatorium->save();
        }
    }

    public function deleteGalleryPhoto(SanatoriumPhoto $sanatoriumPhoto): void
    {
        $sanatoriumPhoto->delete();
    }

    public function deleteFolder(Sanatorium $sanatorium): void
    {
        $this->imageStorageService->deleteFolder($this->getSanatoriumUploadFolder($sanatorium));
    }

    private function getSanatoriumUploadFolder(Sanatorium $sanatorium): string
    {
        return "sanatoriums/{$sanatorium->id}";
    }

}
