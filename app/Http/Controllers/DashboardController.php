<?php

namespace App\Http\Controllers;

use App\Http\Resources\ProductResource;
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

        return Inertia::render('dashboard', [
            'products' => ProductResource::collection($products)->toArray(request())]);
    }
}
