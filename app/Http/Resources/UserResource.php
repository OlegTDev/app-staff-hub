<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin \App\Models\User
 */
class UserResource extends JsonResource
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
            'email' => $this->email,
            'login' => $this->login,
            'company' => $this->company,
            'department' => $this->department,
            'position' => $this->position,
            'telephone' => $this->telephone,
            'domain' => $this->domain,
            'created_at' => $this->created_at,
            'updated_at'=> $this->updated_at,

            'roles' => $this->whenLoaded('roles', fn() => RoleResource::collection($this->roles)),
        ];
    }
}
