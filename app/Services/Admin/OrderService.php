<?php

namespace App\Services\Admin;

use App\Models\Order;
use Illuminate\Support\Facades\DB;

class OrderService
{
    /**
     * Update order items with delivered quantities and update order status
     *
     * @throws \Throwable
     */
    public function updateOrderDelivery(Order $order, array $orderItemsData): Order
    {
        return DB::transaction(function () use ($order, $orderItemsData) {
            $allItemsDelivered = true;

            // Update order items with delivered quantities
            foreach ($orderItemsData as $itemData) {
                $orderItem = $order->orderItems()->find($itemData['id']);
                if ($orderItem) {
                    $qtyDelivered = $itemData['qty_delivered'];
                    $orderItem->update(['qty_delivered' => $qtyDelivered]);

                    // Check if all items are fully delivered
                    if ($qtyDelivered < $orderItem->quantity) {
                        $allItemsDelivered = false;
                    }
                }
            }

            // Update order status based on delivery status
            $order->update([
                'status' => 'delivering',
                'shipped_at' => $order->shipped_at ?? now(),
            ]);

            return $order;
        });
    }

    /**
     * Mark an order as delivered
     *
     * @throws \Throwable
     */
    public function markAsDelivered(Order $order): Order
    {
        return DB::transaction(function () use ($order) {
            // Set all items as fully delivered
            foreach ($order->orderItems as $item) {
                $item->update(['qty_delivered' => $item->quantity]);
            }

            // Mark order as received
            $order->update([
                'status' => 'received',
                'delivered_at' => now(),
            ]);

            return $order;
        });
    }
}
