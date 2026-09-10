<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Image;

class ImageUploadService
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

}
