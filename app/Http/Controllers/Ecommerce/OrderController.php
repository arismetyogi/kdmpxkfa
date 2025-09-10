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
