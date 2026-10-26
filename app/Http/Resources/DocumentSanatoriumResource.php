<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Gate;

/**
 * @mixin \App\Models\Sanatorium\DocumentSanatorium
 */
class DocumentSanatoriumResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $user = $request->user();

        return [
            'id' => $this->id,
            'sanatorium_id' => $this->sanatorium_id,
            'to_organization' => $this->to_organization,
            'to_manager_name' => $this->to_manager_name,
            'app_date' => $this->app_date,
            'user_name' => $this ->user_name,
            'user_organization' => $this->user_organization,
            'user_department' => $this->user_department,
            'user_position' => $this->user_position,
            'user_place' => $this->user_place,
            'user_telephone_inner' => $this->user_telephone_inner,
            'user_telephone_outer' => $this->user_telephone_outer,
            'user_relatives'=> $this->user_relatives,
            'vacation_start' => $this->vacation_start,
            'vacation_end' => $this->vacation_end,
            'any_date_during_vacation' => $this->any_date_during_vacation,
            'arrival_date_from' => $this->arrival_date_from,
            'arrival_date_to' => $this->arrival_date_to,

            'can_edit' => $user !== null && Gate::forUser($user)->allows('update', $this->resource),
            'can_delete' => $user !== null && Gate::forUser($user)->allows('delete', $this->resource),

            'document' => $this->whenLoaded('document', fn() => DocumentResource::make($this->document)),
            'sanatorium' => $this->whenLoaded('sanatorium', fn() => SanatoriumResource::make($this->sanatorium)),
            'sanatoriumsAdditional' => $this->whenLoaded('sanatoriumsAdditional', fn() => SanatoriumResource::collection($this->sanatoriumsAdditional)),
        ];
    }
}
