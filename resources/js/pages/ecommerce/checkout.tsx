import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import HeaderLayout from '@/layouts/header-layout';
import { router } from '@inertiajs/react';
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { type BreadcrumbItem } from '@/types';


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
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: "Medicines", href: route("orders.products") },
  { title: "Cart", href: route("cart") },
  { title: "Checkout", href: "#" },
];


export default function CheckoutPage({ cartItems, totalPrice, subtotal, shipping, tax, billingData, shippingData,  }: CheckoutProps) {
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
        same_as_billing: false,
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
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: checked,
        }));
        console.log(formData);

        // If same_as_billing is checked, copy billing data to shipping data
        if (name === 'same_as_billing' && checked) {
            setFormData((prev) => ({
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
        <HeaderLayout breadcrumbs={breadcrumbs}>
            <div className="container mx-auto max-w-6xl p-2">
                <h1 className="mb-4 text-xl font-bold text-gray-800">Checkout</h1>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-4">
                    {/* Billing & Shipping Information */}
                    <div className="grid grid-cols-1 gap-4 md:col-span-3 md:grid-cols-2">
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
                            <div className="mb-3 flex items-center justify-between">
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

                        {/* Order Items Table */}
                        <div className="md:col-span-2 rounded-lg bg-white p-3 shadow-sm">
                            <h2 className="mb-3 text-sm font-semibold text-gray-800">Your Order Items</h2>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[80px] text-xs">Image</TableHead>
                                        <TableHead className="text-xs">Item</TableHead>
                                        <TableHead className="text-xs">Quantity</TableHead>
                                        <TableHead className="text-xs">Price</TableHead>
                                        <TableHead className="text-right text-xs">Subtotal</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {cartItems.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell>
                                                <img src={item.image} alt={item.name} className="h-12 w-12 object-cover rounded" />
                                            </TableCell>
                                            <TableCell className="text-xs font-medium">{item.name}</TableCell>
                                            <TableCell className="text-xs">
                                                {item.quantity} {item.order_unit}
                                                <span className="block text-gray-500">
                                                    ({item.quantity * item.content} {item.base_uom})
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-xs">Rp{item.price.toLocaleString()}</TableCell>
                                            <TableCell className="text-right text-xs">Rp{(item.price * item.quantity).toLocaleString()}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="md:col-span-1">
                        <div className="border border-gray-200 rounded-2xl p-5 shadow-lg bg-white lg:sticky lg:top-55 self-start ">
                            <h2 className="mb-2 text-sm font-semibold text-gray-800">Order Summary</h2>
                            <div className="space-y-3">
                                <div className="space-y-1">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Subtotal</span>
                                        <span className="text-sm font-medium">Rp{subtotal.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Shipping</span>
                                        <span className="text-sm font-medium text-green-600">
                                            {shipping === 0 ? 'Free' : `Rp${shipping.toLocaleString()}`}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Tax</span>
                                        <span className="text-sm font-medium">Rp{tax.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between border-t pt-5">
                                        <span className="text-sm font-semibold text-primary">Total</span>
                                        <span className="text-sm font-semibold text-primary">Rp{totalPrice.toLocaleString()}</span>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="mt-2 w-full rounded-md bg-primary px-3 py-2 text-xs text-white hover:bg-primary/90"
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