import { router } from '@inertiajs/react';
import React, { useState } from 'react';
import HeaderLayout from '@/layouts/header-layout';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface CartItem {
    id: string | number;
    product_id: number;
    name: string;
    slug: string;
    quantity: number;
    price: number;
    base_price: number;
    image: string;
    order_unit: string;
    base_uom: string;
    content: number;
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
        const { name, value } = e.target;
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
        console.log(formData);

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
            }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.post(route('checkout.process'), formData);
    };

    return (
        <HeaderLayout>
            <div className="container mx-auto p-2 max-w-6xl">
                <h1 className="mb-4 text-xl font-bold text-gray-800">Checkout</h1>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-4">
                    {/* Billing & Shipping Information */}
                    <div className="md:col-span-3 grid grid-cols-1 gap-4 md:grid-cols-2">
                        {/* Billing Information */}
                        <div className="rounded-lg bg-white p-3 shadow-sm">
                            <h2 className="mb-3 text-sm font-semibold text-gray-800">Billing Information</h2>
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                {/* First Name */}
                                <div>
                                    <Label htmlFor="first_name" className="block text-xs font-medium text-gray-700">
                                        First Name *
                                    </Label>
                                    <Input
                                        type="text"
                                        id="first_name"
                                        name="first_name"
                                        value={formData.first_name}
                                        onChange={handleInputChange}
                                        required
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-2 py-1 text-xs"
                                    />
                                </div>
                                {/* Last Name */}
                                <div>
                                    <Label htmlFor="last_name" className="block text-xs font-medium text-gray-700">
                                        Last Name *
                                    </Label>
                                    <Input
                                        type="text"
                                        id="last_name"
                                        name="last_name"
                                        value={formData.last_name}
                                        onChange={handleInputChange}
                                        required
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-2 py-1 text-xs"
                                    />
                                </div>
                                {/* Email */}
                                <div className="sm:col-span-2">
                                    <Label htmlFor="email" className="block text-xs font-medium text-gray-700">
                                        Email Address *
                                    </Label>
                                    <Input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-2 py-1 text-xs"
                                    />
                                </div>
                                {/* Phone */}
                                <div className="sm:col-span-2">
                                    <Label htmlFor="phone" className="block text-xs font-medium text-gray-700">
                                        Phone Number *
                                    </Label>
                                    <Input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        required
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-2 py-1 text-xs"
                                    />
                                </div>
                                {/* Address */}
                                <div className="sm:col-span-2">
                                    <Label htmlFor="address" className="block text-xs font-medium text-gray-700">
                                        Address *
                                    </Label>
                                    <Input
                                        type="text"
                                        id="address"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        required
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-2 py-1 text-xs"
                                    />
                                </div>
                                {/* City */}
                                <div>
                                    <Label htmlFor="city" className="block text-xs font-medium text-gray-700">
                                        City *
                                    </Label>
                                    <Input
                                        type="text"
                                        id="city"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        required
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-2 py-1 text-xs"
                                    />
                                </div>
                                {/* State */}
                                <div>
                                    <Label htmlFor="state" className="block text-xs font-medium text-gray-700">
                                        State/Province *
                                    </Label>
                                    <Input
                                        type="text"
                                        id="state"
                                        name="state"
                                        value={formData.state}
                                        onChange={handleInputChange}
                                        required
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-2 py-1 text-xs"
                                    />
                                </div>
                                {/* ZIP */}
                                <div>
                                    <Label htmlFor="zip" className="block text-xs font-medium text-gray-700">
                                        ZIP/Postal Code *
                                    </Label>
                                    <Input
                                        type="text"
                                        id="zip"
                                        name="zip"
                                        value={formData.zip}
                                        onChange={handleInputChange}
                                        required
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-2 py-1 text-xs"
                                    />
                                </div>
                                {/* Notes */}
                                <div className="sm:col-span-2">
                                    <Label htmlFor="notes" className="block text-xs font-medium text-gray-700">
                                        Order Notes (Optional)
                                    </Label>
                                    <textarea
                                        id="notes"
                                        name="notes"
                                        value={formData.notes}
                                        onChange={handleInputChange}
                                        rows={2}
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-2 py-1 text-xs"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Shipping Information */}
                        <div className="rounded-lg bg-white p-3 shadow-sm">
                            <div className="flex items-center justify-between mb-3">
                                <h2 className="text-sm font-semibold text-gray-800">Shipping Information</h2>
                                <div className="flex items-center">
                                    <Input
                                        type="checkbox"
                                        id="same_as_billing"
                                        name="same_as_billing"
                                        checked={formData.same_as_billing}
                                        onChange={handleCheckboxChange}
                                        className="h-3 w-3 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <Label htmlFor="same_as_billing" className="ml-2 block text-xs text-gray-700">
                                        Same as billing
                                    </Label>
                                </div>
                            </div>

                            {!formData.same_as_billing && (
                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                    {/* Shipping First Name */}
                                    <div>
                                        <Label htmlFor="shipping_first_name" className="block text-xs font-medium text-gray-700">
                                            First Name *
                                        </Label>
                                        <Input
                                            type="text"
                                            id="shipping_first_name"
                                            name="shipping_first_name"
                                            value={formData.shipping_first_name}
                                            onChange={handleInputChange}
                                            required
                                            className="mt-1 block w-full rounded-md border border-gray-300 px-2 py-1 text-xs"
                                        />
                                    </div>
                                    {/* Shipping Last Name */}
                                    <div>
                                        <Label htmlFor="shipping_last_name" className="block text-xs font-medium text-gray-700">
                                            Last Name *
                                        </Label>
                                        <Input
                                            type="text"
                                            id="shipping_last_name"
                                            name="shipping_last_name"
                                            value={formData.shipping_last_name}
                                            onChange={handleInputChange}
                                            required
                                            className="mt-1 block w-full rounded-md border border-gray-300 px-2 py-1 text-xs"
                                        />
                                    </div>
                                    {/* Shipping Email */}
                                    <div className="sm:col-span-2">
                                        <Label htmlFor="shipping_email" className="block text-xs font-medium text-gray-700">
                                            Email *
                                        </Label>
                                        <Input
                                            type="text"
                                            id="shipping_email"
                                            name="shipping_email"
                                            value={formData.shipping_email}
                                            onChange={handleInputChange}
                                            required
                                            className="mt-1 block w-full rounded-md border border-gray-300 px-2 py-1 text-xs"
                                        />
                                    </div>
                                    {/* Shipping Address */}
                                    <div className="sm:col-span-2">
                                        <Label htmlFor="shipping_address" className="block text-xs font-medium text-gray-700">
                                            Address *
                                        </Label>
                                        <Input
                                            type="text"
                                            id="shipping_address"
                                            name="shipping_address"
                                            value={formData.shipping_address}
                                            onChange={handleInputChange}
                                            required
                                            className="mt-1 block w-full rounded-md border border-gray-300 px-2 py-1 text-xs"
                                        />
                                    </div>
                                    {/* Shipping City */}
                                    <div>
                                        <Label htmlFor="shipping_city" className="block text-xs font-medium text-gray-700">
                                            City *
                                        </Label>
                                        <Input
                                            type="text"
                                            id="shipping_city"
                                            name="shipping_city"
                                            value={formData.shipping_city}
                                            onChange={handleInputChange}
                                            required
                                            className="mt-1 block w-full rounded-md border border-gray-300 px-2 py-1 text-xs"
                                        />
                                    </div>
                                    {/* Shipping State */}
                                    <div>
                                        <Label htmlFor="shipping_state" className="block text-xs font-medium text-gray-700">
                                            State/Province *
                                        </Label>
                                        <Input
                                            type="text"
                                            id="shipping_state"
                                            name="shipping_state"
                                            value={formData.shipping_state}
                                            onChange={handleInputChange}
                                            required
                                            className="mt-1 block w-full rounded-md border border-gray-300 px-2 py-1 text-xs"
                                        />
                                    </div>
                                    {/* Shipping ZIP */}
                                    <div>
                                        <Label htmlFor="shipping_zip" className="block text-xs font-medium text-gray-700">
                                            ZIP/Postal Code *
                                        </Label>
                                        <Input
                                            type="text"
                                            id="shipping_zip"
                                            name="shipping_zip"
                                            value={formData.shipping_zip}
                                            onChange={handleInputChange}
                                            required
                                            className="mt-1 block w-full rounded-md border border-gray-300 px-2 py-1 text-xs"
                                        />
                                    </div>
                                </div>
                            )}

                            {formData.same_as_billing && (
                                <div className="text-xs text-gray-500 italic">Shipping address will be the same as billing address</div>
                            )}
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="md:col-span-1">
                        <div className="rounded-lg bg-white p-3 shadow-sm">
                            <h2 className="mb-2 text-sm font-semibold text-gray-800">Order Summary</h2>
                            <div className="space-y-3">
                                <div className="max-h-40 overflow-y-auto">
                                    {cartItems.map((item) => (
                                        <div key={item.id} className="flex items-center justify-between py-1">
                                            <div>
                                                <p className="text-xs font-medium text-gray-800">{item.name}</p>
                                                <p className="text-xs text-gray-500">
                                                    Qty: {item.quantity} {item.order_unit}
                                                    <span className="block">({item.quantity * item.content} {item.base_uom})</span>
                                                </p>
                                            </div>
                                            <p className="text-xs font-medium text-gray-800">
                                                Rp{(item.price * item.quantity).toLocaleString()}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                <div className="border-t pt-3 space-y-1">
                                    <div className="flex justify-between">
                                        <span className="text-xs text-gray-600">Subtotal</span>
                                        <span className="text-xs font-medium">Rp{subtotal.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-xs text-gray-600">Shipping</span>
                                        <span className="text-xs font-medium text-green-600">
                      {shipping === 0 ? "Free" : `Rp${shipping.toLocaleString()}`}
                    </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-xs text-gray-600">Tax</span>
                                        <span className="text-xs font-medium">Rp{tax.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between border-t pt-2">
                                        <span className="text-sm font-semibold text-gray-800">Total</span>
                                        <span className="text-sm font-semibold text-gray-800">Rp{totalPrice.toLocaleString()}</span>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="mt-4 w-full rounded-md bg-indigo-600 px-3 py-2 text-xs text-white hover:bg-indigo-700"
                                >
                                    Proceed to Payment
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </HeaderLayout>
    );
}
