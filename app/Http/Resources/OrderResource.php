<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
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
            'transaction_number' => $this->transaction_number,
            'status' => $this->status,
            'payment_status' => $this->payment_method,
            'total_price' => $this->total_price,
            'billing_name' => $this->billing_name,
            'billing_email' => $this->billing_email,
            'billing_address' => $this->billing_address,
            'billing_city' => $this->billing_city,
            'billing_state' => $this->billing_state,
            'billing_zip' => $this->billing_zip,
            'shipping_name' => $this->shipping_name,
            'shipping_address' => $this->shipping_address,
            'shipping_city' => $this->shipping_city,
            'shipping_state' => $this->shipping_state,
            'shipping_zip' => $this->shipping_zip,
            'created_at' => $this->created_at->format('M d, Y H:i'),
            'order_items' => $this->whenLoaded('orderItems', function () {
                return $this->orderItems->map(function ($item) {
                    $product = $item->product;
                    $imageUrl = $product ? $product->getFirstMediaUrl('images') : null;

                    return [
                        'id' => $item->id,
                        'product_name' => $item->product_name,
                        'product_image' => $imageUrl,
                        'quantity' => $item->quantity,
                        'unit_price' => $item->unit_price,
                        'total_price' => $item->total_price,
                        'product' => $product ? [
                            'order_unit' => $product->order_unit,
                            'base_uom' => $product->base_uom,
                            'content' => $product->content,
                        ] : null,
                    ];
                });
            }, []),
        ];
    }
}
