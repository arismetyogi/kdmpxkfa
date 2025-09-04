import { Head, router } from '@inertiajs/react';
import React, { useState } from 'react';
import HeaderLayout from '@/layouts/header-layout';

interface CartItem {
    id: string | number;
    product_id: number;
    name: string;
    slug: string;
    quantity: number;
    price: number;
    image: string;
}

interface PaymentProps {
    cartItems: CartItem[];
    totalQuantity: number;
    totalPrice: number;
    subtotal: number;
    shipping_amount: number;
    tax: number;
    billing: {
        first_name: string;
        last_name: string;
        email: string;
        phone: string;
        address: string;
        city: string;
        state: string;
        zip: string;
        country: string;
        notes: string;
    };
    shipping: {
        first_name: string;
        last_name: string;
        email: string;
        phone: string;
        address: string;
        city: string;
        state: string;
        zip: string;
        country: string;
    };
}

export default function PaymentPage({
    cartItems,
    totalQuantity,
    totalPrice,
    subtotal,
    shipping_amount,
    tax,
    billing,
    shipping,
}: PaymentProps) {
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('cad');
    const [isProcessing, setIsProcessing] = useState(false);

    const handlePaymentMethodChange = (method: string) => {
        setSelectedPaymentMethod(method);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);

        router.post(route('payment.process'), {
            payment_method: selectedPaymentMethod
        }, {
            onFinish: () => setIsProcessing(false)
        });
    };

    return (
        <HeaderLayout>
            <Head title="Payment" />
            <div className="container mx-auto px-4 py-8">
                <h1 className="mb-8 text-2xl font-bold text-gray-800">Payment</h1>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {/* Payment Methods */}
                    <div className="lg:col-span-2">
                        <div className="rounded-lg bg-white p-6 shadow-sm">
                            <h2 className="mb-4 text-lg font-semibold text-gray-800">Payment Method</h2>

                            <form onSubmit={handleSubmit}>
                                <div className="space-y-4">
                                    <div className="flex items-center">
                                        <input
                                            type="radio"
                                            id="cad"
                                            name="payment_method"
                                            value="cad"
                                            checked={selectedPaymentMethod === 'cad'}
                                            onChange={() => handlePaymentMethodChange('cad')}
                                            className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                        />
                                        <label htmlFor="cod" className="ml-3 block text-sm font-medium text-gray-700">
                                            Cash after Delivery
                                        </label>
                                    </div>

                                    <div className="flex items-center">
                                        <input
                                            type="radio"
                                            id="va"
                                            name="payment_method"
                                            value="va"
                                            checked={selectedPaymentMethod === 'va'}
                                            onChange={() => handlePaymentMethodChange('va')}
                                            className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                        />
                                        <label htmlFor="va" className="ml-3 block text-sm font-medium text-gray-700">
                                            Virtual Account
                                        </label>
                                    </div>
                                </div>

                                <div className="mt-8">
                                    <button
                                        type="submit"
                                        disabled={isProcessing}
                                        className="w-full rounded-md bg-indigo-600 px-4 py-3 text-white hover:bg-indigo-700 disabled:opacity-50"
                                    >
                                        {isProcessing ? 'Processing...' : 'Place Order'}
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Billing & Shipping Info */}
                        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div className="rounded-lg bg-white p-6 shadow-sm">
                                <h3 className="mb-3 text-md font-semibold text-gray-800">Billing Address</h3>
                                <div className="text-sm text-gray-600">
                                    <p>{billing.first_name} {billing.last_name}</p>
                                    <p>{billing.email}</p>
                                    <p>{billing.phone}</p>
                                    <p className="mt-2">{billing.address}</p>
                                    <p>{billing.city}, {billing.state} {billing.zip}</p>
                                    <p>{billing.country}</p>
                                    {billing.notes && (
                                        <p className="mt-2 italic">Notes: {billing.notes}</p>
                                    )}
                                </div>
                            </div>

                            <div className="rounded-lg bg-white p-6 shadow-sm">
                                <h3 className="mb-3 text-md font-semibold text-gray-800">Shipping Address</h3>
                                <div className="text-sm text-gray-600">
                                    <p>{shipping.first_name} {shipping.last_name}</p>
                                    <p>{shipping.email}</p>
                                    <p>{shipping.phone}</p>
                                    <p className="mt-2">{shipping.address}</p>
                                    <p>{shipping.city}, {shipping.state} {shipping.zip}</p>
                                    <p>{shipping.country}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="rounded-lg bg-white p-6 shadow-sm">
                            <h2 className="mb-4 text-lg font-semibold text-gray-800">Order Summary</h2>
                            <div className="space-y-4">
                                <div className="max-h-60 overflow-y-auto">
                                    {cartItems.map((item) => (
                                        <div key={item.id} className="flex items-center justify-between py-2">
                                            <div>
                                                <p className="text-sm font-medium text-gray-800">{item.name}</p>
                                                <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                            </div>
                                            <p className="text-sm font-medium text-gray-800">
                                                Rp{(item.price * item.quantity).toLocaleString()}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                <div className="border-t pt-4">
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Subtotal</span>
                                            <span className="font-medium">Rp{subtotal.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Shipping</span>
                                            <span className="font-medium text-green-600">
                                                {shipping_amount === 0 ? 'Free' : `Rp${shipping_amount.toLocaleString()}`}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Tax</span>
                                            <span className="font-medium">Rp{tax.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between border-t pt-2">
                                            <span className="text-lg font-semibold text-gray-800">Total</span>
                                            <span className="text-lg font-semibold text-gray-800">
                                                Rp{totalPrice.toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </HeaderLayout>
    );
}
