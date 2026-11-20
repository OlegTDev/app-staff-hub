<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin \App\Models\DocumentDelivery
 */
class DocumentDeliveryResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'message_id' => $this->message_id,
            'recipient' => $this->recipient,
            'status' => $this->status->value,
            'status_label' => $this->status->label(),
            'attempts' => $this->attempts,
            'last_error' => $this->last_error,
            'published_at' => $this->published_at,
        ];
    }
}
