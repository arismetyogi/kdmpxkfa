import { Head } from '@inertiajs/react';
import HeaderLayout from '@/layouts/header-layout';
import { CheckCircle } from 'lucide-react';
import {Order} from "@/types";

interface OrderCompletedProps {
    order: Order;
}

export default function OrderCompletedPage({ order }: OrderCompletedProps) {
    return (
        <HeaderLayout>
            <Head title="Order Completed" />
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-8">
                        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
                            <CheckCircle className="h-10 w-10 text-green-600" />
                        </div>
                        <h1 className="mt-4 text-2xl font-bold text-gray-800">Order Placed Successfully!</h1>
                        <p className="mt-2 text-gray-600">
                            Thank you for your order. We've sent a confirmation email to {order.billing_email}.
                        </p>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-800">Order #{order.order_number}</h2>
                                <p className="text-sm text-gray-600">Placed on {order.created_at}</p>
                            </div>
                            <div className="mt-2 sm:mt-0">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                    {order.status}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h3 className="text-md font-semibold text-gray-800 mb-3">Billing Address</h3>
                            <div className="text-sm text-gray-600">
                                <p>{order.billing_full_name}</p>
                                <p>{order.billing_email}</p>
                                <p className="mt-2">{order.billing_address}</p>
                                <p>{order.billing_city}, {order.billing_state} {order.billing_zip}</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h3 className="text-md font-semibold text-gray-800 mb-3">Shipping Address</h3>
                            <div className="text-sm text-gray-600">
                                <p>{order.shipping_full_name}</p>
                                <p className="mt-2">{order.shipping_address}</p>
                                <p>{order.shipping_city}, {order.shipping_state} {order.shipping_zip}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                        <h3 className="text-md font-semibold text-gray-800 mb-4">Order Items</h3>
                        <div className="space-y-4">
                            {order.order_items?.map((item) => (
                                <div key={item.id} className="flex items-center">
                                    {item.product_image ? (
                                        <img
                                            src={item.product_image}
                                            alt={item.product_name}
                                            className="h-16 w-16 rounded-md object-cover"
                                        />
                                    ) : (
                                        <div className="h-16 w-16 rounded-md bg-gray-200 flex items-center justify-center">
                                            <span className="text-xs text-gray-500">No Image</span>
                                        </div>
                                    )}
                                    <div className="ml-4 flex-1">
                                        <h4 className="text-sm font-medium text-gray-800">{item.product_name}</h4>
                                        <p className="text-sm text-gray-600">
                                            {item.quantity} {item.product.order_unit}
                                            <span className="block">({item.quantity * item.product.content} {item.product.base_uom})</span>
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-medium text-gray-800">
                                            Rp{item?.total_price.toLocaleString()}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            Rp{item?.unit_price.toLocaleString()} each
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 pt-4 border-t">
                            <div className="flex justify-between">
                                <span className="text-lg font-semibold text-gray-800">Total</span>
                                <span className="text-lg font-semibold text-gray-800">
                                    Rp{order?.total_price.toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="text-center">
                        <a
                            href={route('orders.products')}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Continue Shopping
                        </a>
                    </div>
                </div>
            </div>
        </HeaderLayout>
    );
}
