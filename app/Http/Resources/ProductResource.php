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
            'description' => $this->description,
            'dosage' => $this->dosage,
            'pharmacology' => $this->pharmacology,
            'category_id' => $this->category_id,
            'category' => $this->category,
            'base_uom' => $this->base_uom,
            'order_unit' => $this->order_unit,
            'content' => $this->content,
            'price' => $this->price,
            'weight' => $this->weight,
            'length' => $this->length,
            'width' => $this->width,
            'height' => $this->height,
            'brand' => $this->brand,
            'image' => $this->getFirstMediaUrl('images'), // 👈 provide preview URL
            'is_active' => $this->is_active,
            'is_featured' => $this->is_featured,
        ];
    }
}
