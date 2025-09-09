<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user();
        
        // Get orders based on user role
        $ordersQuery = Order::with(['user', 'user.apotek']);
        
        // If user is admin apotek, only show orders from users with the same apotek_id
        if ($user->hasRole('admin apotek') && $user->apotek_id) {
            $ordersQuery->whereHas('user', function ($query) use ($user) {
                $query->where('apotek_id', $user->apotek_id);
            });
        }
        // Super admin can view all orders (no additional filtering needed)
        
        $orders = $ordersQuery->latest()->get();
        
        // Calculate statistics
        $totalOrders = $orders->count();
        $newOrders = $orders->where('status', 'new')->count();
        $deliveringOrders = $orders->where('status', 'delivering')->count();
        $completedOrders = $orders->where('status', 'received')->count();
        
        return Inertia::render('admin/orders/index', [
            'orders' => $orders,
            'totalOrders' => $totalOrders,
            'newOrders' => $newOrders,
            'deliveringOrders' => $deliveringOrders,
            'completedOrders' => $completedOrders,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $order = Order::with(['user', 'user.apotek', 'orderItems.product'])->findOrFail($id);
        
        $user = Auth::user();
        
        // Check if user has permission to view this order
        if ($user->hasRole('admin apotek') && $user->apotek_id) {
            if ($order->user->apotek_id !== $user->apotek_id) {
                abort(403, 'Unauthorized access to this order.');
            }
        }
        
        return Inertia::render('admin/orders/show', [
            'order' => $order,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
