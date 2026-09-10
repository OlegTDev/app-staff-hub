<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin \App\Models\Dictionary\Sanatorium
 */
class SanatoriumResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'city' => $this->city,
            'address' => $this ->address,
            'infrastructure' => $this->infrastructure,
            'services' => $this->services,
            'medical_profiles' => $this->medical_profiles,
            'description' => $this->description,
            'created_at' => $this->created_at,
            'updated_at'=> $this->updated_at,
        ];
    }
}
