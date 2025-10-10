import PriceDisplay from '@/components/priceDisplay';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import HeaderLayout from '@/layouts/header-layout';
import { currency } from '@/lib/utils';
import { Order } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { CheckCircle } from 'lucide-react';

export default function OrderCompletedPage() {
    const order = usePage<{ order: Order }>().props.order;
    return (
        <HeaderLayout>
            <Head title="Order Completed" />
            <div className="container mx-auto px-4 py-8">
                <div className="mx-auto max-w-3xl">
                    <div className="mb-8 text-center">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/50">
                            <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
                        </div>
                        <h1 className="mt-4 text-2xl font-bold text-foreground">Order Placed Successfully!</h1>
                        <p className="mt-2 text-muted-foreground">
                            Thank you for your order. We've sent a confirmation email to {order.billing_email}.
                        </p>
                    </div>

                    <div className="mb-6 rounded-lg bg-card p-6 text-card-foreground shadow-sm">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h2 className="text-lg font-semibold">Order #{order.transaction_number}</h2>
                                <p className="text-sm text-muted-foreground">Placed on {order.created_at}</p>
                            </div>
                            <div className="mt-2 sm:mt-0">
                                <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800 dark:bg-green-900 dark:text-green-200">
                                    {order.status}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="rounded-lg bg-card p-6 text-card-foreground shadow-sm">
                            <h3 className="text-md mb-3 font-semibold">Billing Address</h3>
                            <div className="space-y-1 text-sm text-muted-foreground">
                                <p className="text-card-foreground">{order.billing_name}</p>
                                <p>{order.billing_email}</p>
                                <p className="mt-2">{order.billing_address}</p>
                                <p>
                                    {order.billing_city}, {order.billing_state} {order.billing_zip}
                                </p>
                            </div>
                        </div>

                        <div className="rounded-lg bg-card p-6 text-card-foreground shadow-sm">
                            <h3 className="text-md mb-3 font-semibold">Shipping Address</h3>
                            <div className="space-y-1 text-sm text-muted-foreground">
                                <p className="text-card-foreground">{order.shipping_name}</p>
                                <p className="mt-2">{order.shipping_address}</p>
                                <p>
                                    {order.shipping_city}, {order.shipping_state} {order.shipping_zip}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mb-6 flex flex-col rounded-lg bg-card p-6 text-card-foreground shadow-sm">
                        <h3 className="text-md mb-4 font-semibold">Order Items</h3>

                        {/* --- ScrollArea starts here --- */}
                        <ScrollArea className="h-72 flex-grow pr-4">
                            {' '}
                            {/* Set a fixed height and add padding for the scrollbar */}
                            <div className="space-y-4">
                                {order.order_items?.map((item) => (
                                    <div key={item.id} className="flex items-center">
                                        {item.product.image ? (
                                            <img src={item.product?.image[0]} alt={item.product_name} className="h-16 w-16 rounded-md object-cover" />
                                        ) : (
                                            // --- THEME CHANGE #5: Themed image placeholder ---
                                            <div className="flex h-16 w-16 items-center justify-center rounded-md bg-muted">
                                                <span className="text-xs text-muted-foreground">No Image</span>
                                            </div>
                                        )}
                                        <div className="ml-4 flex-1">
                                            <h4 className="text-sm font-medium">{item.product_name}</h4>
                                            <p className="text-sm text-muted-foreground">
                                                {item.quantity} {item.product.order_unit}
                                                <span className="block">
                                                    ({item.quantity * item.product.content} {item.product.base_uom})
                                                </span>
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <PriceDisplay price={item.total_price} />
                                            <p className="text-sm text-muted-foreground">{currency(item?.unit_price)} each</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <ScrollBar orientation="vertical" />
                        </ScrollArea>
                        {/* --- ScrollArea ends here --- */}

                        <div className="mt-6 border-t border-border pt-4">
                            {/* --- THEME CHANGE #6: Use primary color for total for emphasis --- */}
                            <div className="flex justify-between">
                                <span className="text-lg font-semibold text-primary">Total</span>
                                <span className="text-lg font-semibold text-primary">{currency(order.total_price)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons are already themed via the Button component */}
                    <div className="mt-4 flex flex-col justify-center gap-3 sm:flex-row">
                        <Link href="/orders/history" className="w-full sm:w-auto">
                            <Button variant="outline" className="w-full">
                                Go to Order History
                            </Button>
                        </Link>
                        <Link href={route('orders.products')} className="w-full sm:w-auto">
                            <Button className="w-full bg-blue-600 hover:bg-blue-600/90">Continue Shopping</Button>
                        </Link>
                    </div>
                </div>
            </div>
        </HeaderLayout>
    );
}
