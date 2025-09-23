<?php

namespace App\Http\Controllers\Ecommerce;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Inertia\Inertia;

class PackageController extends Controller
{
    public function index()
    {
        // Fetch random products from the database
        $products = Product::with('category')
            ->inRandomOrder()
            ->take(8)
            ->get()
            ->map(function ($product) {
                // Set assignedQuantity to always be the same as maxQuantity
                $maxQuantity = rand(1, 5);
                $assignedQuantity = $maxQuantity;
                
                return [
                    'id' => $product->id,
                    'sku' => $product->sku,
                    'name' => $product->name,
                    'slug' => $product->slug,
                    'category_id' => $product->category_id,
                    'price' => $product->price,
                    'weight' => $product->weight,
                    'base_uom' => $product->base_uom,
                    'order_unit' => $product->order_unit,
                    'content' => $product->content,
                    'image' => $product->getFirstImageUrl(),
                    'description' => $product->description,
                    'is_active' => $product->is_active,
                    'assignedQuantity' => $assignedQuantity,
                    'maxQuantity' => $maxQuantity
                ];
            })->toArray();

        return Inertia::render('orders/Package', [
            'products' => $products
        ]);
    }
}