<?php

namespace App\Models;

use App\Models\DocumentStatus;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * @property int $id
 * @property int $user_id
 * @property DocumentStatus $status
 * @property \Carbon\CarbonInterface $created_at
 * @property \Carbon\CarbonInterface $updated_at
 *
 * @property-read User $user
 */
#[Fillable(['status', 'user_id'])]
class Document extends Model
{
    use SoftDeletes;

    protected function casts(): array
    {
        return [
            'status' => DocumentStatus::class,
        ];
    }

    public function requestable(): MorphTo
    {
        return $this->morphTo();
    }

    public function user(): HasOne
    {
        return $this->hasOne(User::class);
    }
}
