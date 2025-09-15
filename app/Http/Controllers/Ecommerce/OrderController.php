<?php

namespace App\Http\Controllers\Ecommerce;

use App\Http\Controllers\Controller;
use App\Http\Resources\PaginatedResourceResponse;
use App\Http\Resources\ProductResource;
use App\Models\Category;
use App\Models\Order;
use App\Models\Product;
use App\Services\DigikopTransactionService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{
    protected $digikopTransactionService;

    public function __construct(DigikopTransactionService $digikopTransactionService)
    {
        $this->digikopTransactionService = $digikopTransactionService;
    }
    public function index(Request $request)
    {
        // Start building the query
        $query = Product::with('category')
            ->select(['id', 'sku', 'slug', 'name', 'price', 'image', 'category_id', 
                'order_unit', 'is_active', 'content', 'base_uom', 'brand', 'is_featured',
                'weight', 'pharmacology', 'dosage', 'description', 'length', 'width', 'height']);

        // 🔍 Pencarian
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('sku', 'like', "%{$search}%")
                    ->orWhere('content', 'like', "%{$search}%");
            });
        }

        // 🔎 Filter kategori
        if ($request->filled('categories')) {
            $categories = (array) $request->categories;
            // Remove "Semua Produk" if it exists
            $categories = array_filter($categories, function($cat) {
                return $cat !== "Semua Produk";
            });
            
            if (!empty($categories)) {
                $query->whereHas('category', function ($q) use ($categories) {
                    $q->whereIn('subcategory1', $categories);
                });
            }
        }

        // 🔹 Filter Package (base_uom)
        if ($request->filled('packages')) {
            $packages = (array) $request->packages;
            // Remove "Semua Paket" if it exists
            $packages = array_filter($packages, function($pack) {
                return $pack !== "Semua Paket";
            });
            
            if (!empty($packages)) {
                $query->whereIn('base_uom', $packages);
            }
        }

        //  Sorting
        if ($request->filled('sort_by')) {
            $sortBy = $request->sort_by;
            if ($sortBy === 'lowest') {
                $query->orderBy('price', 'asc');
            } elseif ($sortBy === 'highest') {
                $query->orderBy('price', 'desc');
            } elseif ($sortBy === 'name-desc') {
                $query->orderBy('name', 'desc');
            } else {
                // Default to 'name-asc'
                $query->orderBy('name', 'asc');
            }
        } else {
            $query->orderBy('name', 'asc'); // Default sort
        }
        
        $products = $query->paginate(12)->withQueryString();

        // Get all unique categories and packages for the filter dropdowns
    $allCategories = Category::query()
        ->whereNotNull('subcategory1')
        ->distinct()
        ->pluck('subcategory1');

    $allPackages = Product::query()
        ->whereNotNull('base_uom')
        ->distinct()
        ->pluck('base_uom');

        return Inertia::render('orders/index', [
            'products' => PaginatedResourceResponse::make($products, ProductResource::class),
            'allCategories' => $allCategories, 
            'allPackages' => $allPackages,    
            'filters' => $request->only(['search', 'categories', 'packages', 'sort_by']),
        ]); 
    }


    public function history()
    {
        // Get orders for the authenticated user
        $orders = Order::with(['user', 'orderItems.product'])
            ->where('user_id', auth()->id())
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('orders/history', [
            'orders' => $orders,
        ]);
    }

    public function acceptOrder(Request $request, Order $order)
    {
        // Ensure the order belongs to the authenticated user
        if ($order->user_id !== auth()->id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        // Update the order status to accepted
        $order->update(['status' => 'diterima']);
        $this->digikopTransactionService->updateTransactionStatus($order, 'diterima');

        return response()->json(['message' => 'Order accepted successfully']);
    }
}
