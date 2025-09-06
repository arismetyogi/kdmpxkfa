<?php

namespace App\Http\Controllers\Ecommerce;

use App\Http\Controllers\Controller;
use App\Http\Resources\PaginatedResourceResponse;
use App\Http\Resources\ProductResource;
use App\Models\Category;
use App\Models\Product;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function index()
    {
        $products = Product::with('category')->latest()->paginate(15);

        return Inertia::render('orders/index', [
            'products' => PaginatedResourceResponse::make($products, ProductResource::class),
            'categories' => Category::all(),
        ]);
    }

    public function history()
    {
        return Inertia::render('orders/history', []);
    }
}
