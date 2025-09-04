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

interface CheckoutProps {
    cartItems: CartItem[];
    totalQuantity: number;
    totalPrice: number;
    subtotal: number;
    shipping: number;
    tax: number;
    billingData: {
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
    shippingData: {
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
    sameAsBilling: boolean;
}

export default function CheckoutPage({
    cartItems,
    totalQuantity,
    totalPrice,
    subtotal,
    shipping,
    tax,
    billingData,
    shippingData,
    sameAsBilling,
}: CheckoutProps) {
    const [formData, setFormData] = useState({
        first_name: billingData?.first_name || '',
        last_name: billingData?.last_name || '',
        email: billingData?.email || '',
        phone: billingData?.phone || '',
        address: billingData?.address || '',
        city: billingData?.city || '',
        state: billingData?.state || '',
        zip: billingData?.zip || '',
        country: billingData?.country || 'Indonesia',
        notes: billingData?.notes || '',
        same_as_billing: sameAsBilling,
        shipping_first_name: shippingData?.first_name || billingData?.first_name || '',
        shipping_last_name: shippingData?.last_name || billingData?.last_name || '',
        shipping_email: shippingData?.email || billingData?.email || '',
        shipping_phone: shippingData?.phone || billingData?.phone || '',
        shipping_address: shippingData?.address || billingData?.address || '',
        shipping_city: shippingData?.city || billingData?.city || '',
        shipping_state: shippingData?.state || billingData?.state || '',
        shipping_zip: shippingData?.zip || billingData?.zip || '',
        shipping_country: shippingData?.country || billingData?.country || 'Indonesia',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        // @ts-ignore
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: checked
        }));

        // If same_as_billing is checked, copy billing data to shipping data
        if (name === 'same_as_billing' && checked) {
            setFormData(prev => ({
                ...prev,
                shipping_first_name: prev.first_name,
                shipping_last_name: prev.last_name,
                shipping_email: prev.email,
                shipping_phone: prev.phone,
                shipping_address: prev.address,
                shipping_city: prev.city,
                shipping_state: prev.state,
                shipping_zip: prev.zip,
                shipping_country: prev.country,
            }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.post(route('checkout.process'), formData);
    };

    return (
        <HeaderLayout>
            <Head title="Checkout" />
            <div className="container mx-auto px-4 py-8">
                <h1 className="mb-8 text-2xl font-bold text-gray-800">Checkout</h1>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {/* Billing & Shipping Information */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Billing Information */}
                        <div className="rounded-lg bg-white p-6 shadow-sm">
                            <h2 className="mb-4 text-lg font-semibold text-gray-800">Billing Information</h2>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
                                        First Name *
                                    </label>
                                    <input
                                        type="text"
                                        id="first_name"
                                        name="first_name"
                                        value={formData.first_name}
                                        onChange={handleInputChange}
                                        required
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
                                        Last Name *
                                    </label>
                                    <input
                                        type="text"
                                        id="last_name"
                                        name="last_name"
                                        value={formData.last_name}
                                        onChange={handleInputChange}
                                        required
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                                    />
                                </div>
                                <div className="sm:col-span-2">
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                        Email Address *
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                                    />
                                </div>
                                <div className="sm:col-span-2">
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                        Phone Number *
                                    </label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        required
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                                    />
                                </div>
                                <div className="sm:col-span-2">
                                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                                        Address *
                                    </label>
                                    <input
                                        type="text"
                                        id="address"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        required
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                                        City *
                                    </label>
                                    <input
                                        type="text"
                                        id="city"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        required
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                                        State/Province *
                                    </label>
                                    <input
                                        type="text"
                                        id="state"
                                        name="state"
                                        value={formData.state}
                                        onChange={handleInputChange}
                                        required
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="zip" className="block text-sm font-medium text-gray-700">
                                        ZIP/Postal Code *
                                    </label>
                                    <input
                                        type="text"
                                        id="zip"
                                        name="zip"
                                        value={formData.zip}
                                        onChange={handleInputChange}
                                        required
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                                        Country *
                                    </label>
                                    <input
                                        type="text"
                                        id="country"
                                        name="country"
                                        value={formData.country}
                                        onChange={handleInputChange}
                                        required
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                                    />
                                </div>
                                <div className="sm:col-span-2">
                                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                                        Order Notes (Optional)
                                    </label>
                                    <textarea
                                        id="notes"
                                        name="notes"
                                        value={formData.notes}
                                        onChange={handleInputChange}
                                        rows={3}
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Shipping Information */}
                        <div className="rounded-lg bg-white p-6 shadow-sm">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-gray-800">Shipping Information</h2>
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="same_as_billing"
                                        name="same_as_billing"
                                        checked={formData.same_as_billing}
                                        onChange={handleCheckboxChange}
                                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <label htmlFor="same_as_billing" className="ml-2 block text-sm text-gray-700">
                                        Same as billing information
                                    </label>
                                </div>
                            </div>

                            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <label htmlFor="shipping_first_name" className="block text-sm font-medium text-gray-700">
                                        First Name *
                                    </label>
                                    <input
                                        type="text"
                                        id="shipping_first_name"
                                        name="shipping_first_name"
                                        value={formData.shipping_first_name}
                                        onChange={handleInputChange}
                                        required
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="shipping_last_name" className="block text-sm font-medium text-gray-700">
                                        Last Name *
                                    </label>
                                    <input
                                        type="text"
                                        id="shipping_last_name"
                                        name="shipping_last_name"
                                        value={formData.shipping_last_name}
                                        onChange={handleInputChange}
                                        required
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                                    />
                                </div>
                                <div className="sm:col-span-2">
                                    <label htmlFor="shipping_email" className="block text-sm font-medium text-gray-700">
                                        Email Address *
                                    </label>
                                    <input
                                        type="email"
                                        id="shipping_email"
                                        name="shipping_email"
                                        value={formData.shipping_email}
                                        onChange={handleInputChange}
                                        required
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                                    />
                                </div>
                                <div className="sm:col-span-2">
                                    <label htmlFor="shipping_phone" className="block text-sm font-medium text-gray-700">
                                        Phone Number *
                                    </label>
                                    <input
                                        type="tel"
                                        id="shipping_phone"
                                        name="shipping_phone"
                                        value={formData.shipping_phone}
                                        onChange={handleInputChange}
                                        required
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                                    />
                                </div>
                                <div className="sm:col-span-2">
                                    <label htmlFor="shipping_address" className="block text-sm font-medium text-gray-700">
                                        Address *
                                    </label>
                                    <input
                                        type="text"
                                        id="shipping_address"
                                        name="shipping_address"
                                        value={formData.shipping_address}
                                        onChange={handleInputChange}
                                        required
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="shipping_city" className="block text-sm font-medium text-gray-700">
                                        City *
                                    </label>
                                    <input
                                        type="text"
                                        id="shipping_city"
                                        name="shipping_city"
                                        value={formData.shipping_city}
                                        onChange={handleInputChange}
                                        required
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="shipping_state" className="block text-sm font-medium text-gray-700">
                                        State/Province *
                                    </label>
                                    <input
                                        type="text"
                                        id="shipping_state"
                                        name="shipping_state"
                                        value={formData.shipping_state}
                                        onChange={handleInputChange}
                                        required
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="shipping_zip" className="block text-sm font-medium text-gray-700">
                                        ZIP/Postal Code *
                                    </label>
                                    <input
                                        type="text"
                                        id="shipping_zip"
                                        name="shipping_zip"
                                        value={formData.shipping_zip}
                                        onChange={handleInputChange}
                                        required
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="shipping_country" className="block text-sm font-medium text-gray-700">
                                        Country *
                                    </label>
                                    <input
                                        type="text"
                                        id="shipping_country"
                                        name="shipping_country"
                                        value={formData.shipping_country}
                                        onChange={handleInputChange}
                                        required
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                                    />
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
                                                {shipping === 0 ? 'Free' : `Rp${shipping.toLocaleString()}`}
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

                                    <button
                                        type="submit"
                                        className="mt-6 w-full rounded-md bg-indigo-600 px-4 py-3 text-white hover:bg-indigo-700"
                                    >
                                        Proceed to Payment
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </HeaderLayout>
    );
}
