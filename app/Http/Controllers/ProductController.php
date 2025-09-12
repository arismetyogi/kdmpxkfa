<?php
namespace App\Http\Controllers;

use App\Models\Product;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::query()
            ->select('id', 'name', 'slug', 'sku', 'price', 'is_active', 'image')
            ->where('is_active', true)
            ->latest()
            ->get();

    }

}
