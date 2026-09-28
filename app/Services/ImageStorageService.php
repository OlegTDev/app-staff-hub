<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Image;
use Illuminate\Support\Facades\Storage;

class ImageStorageService
{
    private string $disk;

    public function __construct(
        private int $width,
        private int $height,
        private bool $isPrivate = false)
    {
        $this->disk = $this->isPrivate ? 'private' : 'public';
    }

    /**
     * @return array{image: string|null, thumb: string|null}
     */
    public function upload(UploadedFile $uploadImage, string $folder = '/', int $width = null, int $height = null): array
    {
        $storePath = ['image' => null, 'thumb' => null];
        $image = Image::fromUpload($uploadImage);
        if ($width !== null || $height !== null) {
            $image = $image->scale($width, $height);
        }

        $filename = \sprintf('%s.%s',
            pathinfo($uploadImage->hashName(), PATHINFO_FILENAME),
            'webp',
        );

        $storePath['image'] = $image
            ->toWebp()
            ->storeAs(path: $folder, name: $filename, disk: $this->disk);

        return $storePath;
    }

    /**
     * @return array<array{image: string, thumb: string}>
     */
    public function uploadMultiple(array $uploadImages, string $folder = '/', bool $withThumb = false): array
    {
        $storePaths = [];
        foreach ($uploadImages as $uploadImage) {
            $storePath = [];

            $storePath['image'] = $uploadImage->store($folder, $this->disk);

            if ($withThumb) {
                $storePath['thumb'] = $this->createThumb($folder, $uploadImage);
            }
            $storePaths[] = $storePath;
        }
        return $storePaths;
    }

    private function createThumb(string $folder, UploadedFile $uploadImage): string
    {
        $image = Image::fromUpload($uploadImage);

        $filename = \sprintf('thumb_%s.%s',
            pathinfo($uploadImage->hashName(), PATHINFO_FILENAME),
            '.webp',
        );

        if ($image->height() > $this->height || $image->width() > $this->width) {
            $image = $image
                ->scale($this->width, $this->height);
        }

        $storagePath = $image
            ->toWebp()
            ->storeAs(path: $folder, name: $filename, disk: $this->disk);

        return $storagePath;
    }

    public function deleteImage(string|array $url): bool
    {
        return Storage::disk($this->disk)->delete($url);
    }

    public function deleteFolder(string $folder): bool
    {
        return Storage::disk($this->disk)->deleteDirectory($folder);
    }

}
