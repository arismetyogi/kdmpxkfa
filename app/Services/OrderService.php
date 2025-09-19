<?php

namespace App\Services;

use App\Enums\OrderStatusEnum;
use App\Models\Order;
use Illuminate\Support\Facades\DB;

class OrderService
{
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        //
    }

    /**
     * Mark an order as delivered
     *
     * @throws \Throwable
     */
    public function markAsDelivered(Order $order): Order
    {
        return DB::transaction(function () use ($order) {
            // Mark order as received
            $order->update([
                'status' => OrderStatusEnum::RECEIVED->value,
                'delivered_at' => now(),
            ]);

            return $order;
        });
    }
}
