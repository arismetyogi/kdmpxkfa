<?php

namespace App\Http\Controllers\Ecommerce;

use App\Enums\OrderStatusEnum;
use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Services\DigikopTransactionService;
use App\Services\OrderService;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;


class HistoryController extends Controller
{
    public function history()
    {
        $orders = Order::with([
            'orderItems.product',
            'user.apotek', // eager load relasi apotek dari user
        ])->latest()->get();


        return Inertia::render('orders/history', [
            'orders' => $orders,
            'statusColors' => OrderStatusEnum::colors(),
            'statusFilters' => OrderStatusEnum::toArray(),
        ]);
    }

    public function show($transaction_number)
    {
        $order = Order::with([
            'orderItems.product',
            'user.apotek', // eager load relasi apotek dari user
        ])->where('transaction_number', $transaction_number)->firstOrFail();

        // Added 'processed' step to the timeline data
        $timeline = [
            ['key' => 'dibuat', 'label' => 'Order Made', 'time' => $order->created_at],
            ['key' => 'diproses', 'label' => 'Processed'],
            ['key' => 'dalam pengiriman', 'label' => 'On Delivery', 'time' => $order->shipped_at],
            ['key' => 'diterima', 'label' => 'Received', 'time' => $order->delivered_at],
        ];

        return Inertia::render('orders/details', [
            'order' => $order,
            'timeline' => $timeline,
            'buyer' => [
                'name' => $order->billing_name,
                'email' => $order->billing_email,
                'phone' => $order->billing_phone,
                'address' => $order->billing_address,
                'city' => $order->billing_city,
                'state' => $order->billing_state,
                'zip' => $order->billing_zip,
            ],
            'apotek' => $order->user?->apotek,
        ]);
    }

    /**
     * @throws \Throwable
     */
    public function updateStatus(Request $request, $transaction_number, OrderService $orderService, DigikopTransactionService $apiService)
    {
        $request->validate([
            'status' => ['required', Rule::enum(OrderStatusEnum::class)],
        ]);

        $order = Order::where('transaction_number', $transaction_number)->firstOrFail();

        $apiService->updateTransactionStatus($order, OrderStatusEnum::tryFrom($request->status));
        $orderService->markAsDelivered($order);

        return redirect()
            ->route('history.show', ['transaction_number' => $transaction_number])
            ->with('success', 'Order status updated successfully.');
    }
}
