<?php

namespace App\Models\Dictionary;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

/**
 * @property int $id
 * @property int $sanatorium_id
 * @property string $type
 * @property string $photo_file
 * @property string $thumb_file
 * @property \Carbon\CarbonInterface $created_at
 * @property \Carbon\CarbonInterface $updated_at
 *
 * @property-read Sanatorium $sanatorium
 */
#[Fillable(['sanatorium_id', 'type', 'photo_file', 'thumb_file'])]
class SanatoriumPhoto extends Model
{
    protected static function booted(): void
    {
        static::deleted(static function (self $photo) {
            Storage::delete([$photo->photo_file, $photo->thumb_file]);
        });
    }

    public function sanatorium(): BelongsTo
    {
        return $this->belongsTo(Sanatorium::class);
    }

    public function getPhotoUrlAttribute(): string
    {
        return Storage::url($this->photo_file);
    }

}
