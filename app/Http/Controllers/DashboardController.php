<?php

namespace App\Http\Controllers;

use App\Http\Resources\ProductResource;
use App\Models\OrderItem;
use App\Models\Product;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $products = Product::query()
            ->where('is_active', true)
            ->latest()
            ->with('category')
            ->paginate(12);

        $top_products = Product::withCount('orderItems')
            ->orderByDesc('order_items_count')
            ->take(5)
            ->get();


        return Inertia::render('dashboard', [
            'products' => ProductResource::collection($products)->toArray(request()),
            'top_products' => ProductResource::collection($top_products)->toArray(request())
        ]);
    }
}
