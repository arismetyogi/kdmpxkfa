<?php

namespace App\Http\Controllers\Ecommerce;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Order;

class HistoryController extends Controller
{
    public function history()
    {
        $orders = Order::with([
            'products' => function ($q) {
                $q->select('products.id', 'sku', 'name', 'price', 'image')
                  ->withPivot('quantity');
            },
            'user.apotek' // eager load relasi apotek dari user
        ])->latest()->get();

        return Inertia::render('orders/history', [
            'orders' => $orders,
        ]);
    }

    public function show($transaction_number)
    {
        $order = Order::with([
            'products' => function ($q) {
                $q->select('products.id', 'sku', 'name', 'price', 'image')
                  ->withPivot('quantity');
            },
            'user.apotek'
        ])->where('transaction_number', $transaction_number)->firstOrFail();

        $timeline = [
            ['key' => 'made', 'label' => 'Order Made', 'time' => $order->created_at],
            ['key' => 'On Delivery', 'label' => 'On Delivery', 'time' => $order->shipped_at],
            ['key' => 'Received', 'label' => 'Received', 'time' => $order->delivered_at],
        ];

        return Inertia::render('orders/details', [
            'order'    => $order,
            'timeline' => $timeline,
            'buyer'    => [
                'name'    => $order->billing_name,
                'email'   => $order->billing_email,
                'phone'   => $order->billing_phone,
                'address' => $order->billing_address,
                'city'    => $order->billing_city,
                'state'   => $order->billing_state,
                'zip'     => $order->billing_zip,
            ],
            'apotek'   => $order->user?->apotek,
        ]);
    }

    public function updateStatus(Request $request, $transaction_number)
{
    $request->validate([
        'status' => 'required|in:made,On Delivery,Received',
    ]);

    $order = Order::where('transaction_number', $transaction_number)->firstOrFail();

    switch ($request->status) {
        case 'On Delivery':
            $order->status = 'On Delivery';
            $order->shipped_at = now();
            break;

        case 'Received':
            $order->status = 'Received';
            $order->delivered_at = now();
            break;
    }

    $order->save();

    return redirect()
        ->route('history.show', ['transaction_number' => $transaction_number])
        ->with('success', 'Order status updated successfully.');
}
}