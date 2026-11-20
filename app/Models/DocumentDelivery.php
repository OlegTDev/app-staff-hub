<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\DeliveryStatus;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property string $message_id
 * @property int $document_id
 * @property string $recipient
 * @property DeliveryStatus $status
 * @property int $attempts
 * @property string|null $last_error
 * @property \Carbon\CarbonInterface|null $published_at
 * @property \Carbon\CarbonInterface $created_at
 * @property \Carbon\CarbonInterface $updated_at
 *
 * @property-read Document $document
 */
#[Fillable(['message_id', 'document_id', 'recipient', 'status', 'attempts', 'last_error', 'published_at'])]
class DocumentDelivery extends Model
{
    protected function casts(): array
    {
        return [
            'status' => DeliveryStatus::class,
            'attempts' => 'integer',
            'published_at' => 'datetime',
        ];
    }

    public function document(): BelongsTo
    {
        return $this->belongsTo(Document::class);
    }

    public function markPublished(): void
    {
        $this->update([
            'status' => DeliveryStatus::PUBLISHED,
            'published_at' => now(),
            'last_error' => null,
        ]);
    }

    public function markFailed(string $error): void
    {
        $this->update([
            'status' => DeliveryStatus::FAILED,
            'last_error' => $error,
        ]);
    }

    public function registerAttempt(): void
    {
        $this->increment('attempts');
    }
}
