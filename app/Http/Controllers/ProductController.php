<?php
namespace App\Http\Controllers;

use App\Http\Resources\PaginatedResourceResponse;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::query()
            ->where('is_active', true)
            ->latest()
            ->with('category')
            ->paginate(12);

        // dd($products);
        Log::info('Products retrieved: ', ['products' => $products->items()]);

        return Inertia::render('dashboard', [ 
            'products' => ProductResource::collection($products)->toArray(request())]);
    }
}
