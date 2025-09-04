<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

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
            'uuid' => $this->uuid,
            'name' => $this->name,
            'email' => $this->email,
            'apotek_id' => $this->apotek_id,
            'apotek' => $this->apotek,
            'roles' => $this->roles,
            'permissions' => $this->getAllPermissions(),
            'avatar' => $this->getFirstMediaUrl('avatar'),
            'is_active' => $this->is_active,
            'onboarding_info' => [
                'user_id' => $this->external_id,
                'tenant_id' => $this->tenant_id,
                'tenant_name' => $this->tenant_name,
                'phone' => $this->phone,
            ],
        ];
    }
}
