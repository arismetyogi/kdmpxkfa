<?php

namespace App\Notifications;

use App\Models\Order;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewOrderNotification extends Notification
{
    use Queueable;

    protected Order $order;
    protected User $customer;

    /**
     * Create a new notification instance.
     */
    public function __construct(Order $order, User $customer)
    {
        $this->order = $order;
        $this->customer = $customer;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database']; // Using database channel for admin notifications
    }

    /**
     * Get the database representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toDatabase(object $notifiable): array
    {
        return [
            'order_id' => $this->order->id,
            'order_number' => $this->order->transaction_number,
            'customer_name' => $this->customer->name,
            'customer_email' => $this->customer->email,
            'message' => "New order #{$this->order->transaction_number} has been placed by {$this->customer->name}",
            'created_at' => now(),
        ];
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'order_id' => $this->order->id,
            'order_number' => $this->order->transaction_number,
            'customer_name' => $this->customer->name,
            'customer_email' => $this->customer->email,
            'message' => "New order #{$this->order->transaction_number} has been placed by {$this->customer->name}",
            'created_at' => now(),
        ];
    }
}
