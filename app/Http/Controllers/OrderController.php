<?php

namespace App\Http\Controllers;

use App\Http\Resources\ProductResource;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function index()
    {
        $products = Product::with('category')->latest()->paginate(15);
        $productResource = ProductResource::collection($products);
        return Inertia::render('orders/index', compact('productResource'));
    }

    public function cart()
    {
        return Inertia::render('orders/cart', []);
    }

    public function po()
    {
        return Inertia::render('orders/po', []);
    }

    public function history()
    {
        return Inertia::render('orders/history', []);
    }
}
