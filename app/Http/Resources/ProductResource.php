<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
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
            'sku' => $this->sku,
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description ?? null,
            'dosage' => $this->dosage ?? [],
            'pharmacology' => $this->pharmacology ?? null,
            'category_id' => $this->category_id ?? null,
            'category' => $this->category,
            'base_uom' => $this->base_uom,
            'order_unit' => $this->order_unit,
            'content' => $this->content,
            'price' => $this->price,
            'weight' => $this->weight ?? 0,
            'length' => $this->length ?? 0,
            'width' => $this->width ?? 0,
            'height' => $this->height ?? 0,
            'brand' => $this->brand ?? 'No Brand',
            'image' => $this->image ?? asset('products/Placeholder_Medicine.png') ?? null, // 👈 provide preview URL
            'is_active' => $this->is_active,
            'is_featured' => $this->is_featured,
        ];
    }
}
