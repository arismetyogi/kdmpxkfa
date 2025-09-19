import HeaderLayout from '@/layouts/header-layout';
import React, { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CreditCard, Wallet } from 'lucide-react';

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

interface PaymentProps {
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
    billing,
    shipping,
}: PaymentProps) {
    const [sourceOfFund] = useState('pinjaman');
    const [paymentType, setPaymentType] = useState('CAD'); // Default to Cash on Delivery / Against Document
    const [isProcessing, setIsProcessing] = useState(false);
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    
    // Placeholder for credit, replace with actual data if available
    const storedData = localStorage.getItem('creditLimitData')|| 'null';
    const parsedData = JSON.parse(storedData);
    const creditLimit = parsedData.creditLimit;
    

    useEffect(() => {
        const storedCart = localStorage.getItem("cart");
        if (storedCart) setCartItems(JSON.parse(storedCart));
    }, [])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);

        const cartData = localStorage.getItem("cart") || "[]";
        
        router.post(route('payment.process'), {
            source_of_fund: sourceOfFund,
            payment_type: paymentType,
            cart: JSON.parse(cartData)
        }, {
            onSuccess: () => {
                localStorage.removeItem("cart");
            },
            onFinish: () => {
                setIsProcessing(false);
            }
        });
    };

    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const ppn = subtotal * 0.11;
    const grandTotal = subtotal + ppn;
    const shipping_amount = 0;

    return (
        <HeaderLayout>
            <Head title="Payment" />
            <div className="container mx-auto px-4 py-8">
                <h1 className="mb-8 text-2xl font-bold text-gray-800">Payment</h1>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {/* Payment Methods */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Payment Method</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    {/* Mandiri (Disabled) */}
                                    <div className="cursor-not-allowed rounded-xl p-4 flex items-center justify-between border-2 border-gray-200 opacity-50">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-yellow-400 p-3 rounded-full">
                                                <CreditCard className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-800">Bank Mandiri</h3>
                                                <p className="text-sm text-gray-600">Virtual Account</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* BCA (Disabled) */}
                                    <div className="cursor-not-allowed rounded-xl p-4 flex items-center justify-between border-2 border-gray-200 opacity-50">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-blue-500 p-3 rounded-full">
                                                <CreditCard className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-800">Bank BCA</h3>
                                                <p className="text-sm text-gray-600">Virtual Account</p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* pinjaman Koperasi (Enabled) */}
                                    <div
                                        className={`rounded-xl p-4 flex flex-col gap-3 border-2 transition-all duration-200 ${
                                            sourceOfFund === 'pinjaman' ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="bg-gray-500 p-3 rounded-full">
                                                <Wallet className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-800">Kredit Koperasi</h3>
                                                <p className="text-sm text-gray-600">
                                                    Remaining Credits: Rp {creditLimit.toLocaleString()}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mt-2 pl-12">
                                            <Label className="mb-2 block font-medium">Payment Type</Label>
                                            <Select value={paymentType} onValueChange={setPaymentType}>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select payment type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="CAD">Cash on Delivery</SelectItem>
                                                    <SelectItem value="TOP 30" disabled>Term of Payment 30 Days</SelectItem>
                                                    <SelectItem value="TOP 60" disabled>Term of Payment 60 Days</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="pt-4">
                                        <button
                                            type="submit"
                                            disabled={isProcessing}
                                            className="w-full rounded-md bg-indigo-600 px-4 py-3 text-white hover:bg-indigo-700 disabled:opacity-50"
                                        >
                                            {isProcessing ? 'Processing...' : 'Place Order'}
                                        </button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>

                        {/* Billing & Shipping Info */}
                        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                             <div className="rounded-lg bg-white p-6 shadow-sm">
                                <h3 className="mb-3 text-md font-semibold text-gray-800">Billing Address</h3>
                                <div className="text-sm text-gray-600">
                                    <p>
                                        {billing.first_name} {billing.last_name}
                                    </p>
                                    <p>{billing.email}</p>
                                    <p>{billing.phone}</p>
                                    <p className="mt-2">{billing.address}</p>
                                    <p>
                                        {billing.city}, {billing.state} {billing.zip}
                                    </p>
                                    <p>{billing.country}</p>
                                    {billing.notes && <p className="mt-2 italic">Notes: {billing.notes}</p>}
                                </div>
                            </div>

                            <div className="rounded-lg bg-white p-6 shadow-sm">
                                <h3 className="text-md mb-3 font-semibold text-gray-800">Shipping Address</h3>
                                <div className="text-sm text-gray-600">
                                    <p>
                                        {shipping.first_name} {shipping.last_name}
                                    </p>
                                    <p>{shipping.email}</p>
                                    <p>{shipping.phone}</p>
                                    <p className="mt-2">{shipping.address}</p>
                                    <p>
                                        {shipping.city}, {shipping.state} {shipping.zip}
                                    </p>
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
                                <div className="max-h-60 overflow-y-auto pr-2">
                                    {cartItems.map((item) => (
                                        <div key={item.id} className="flex items-start justify-between py-2">
                                            <div className='flex-1'>
                                                <p className="text-sm font-medium text-gray-800">{item.name}</p>
                                                <p className="text-xs text-gray-500">
                                                    Qty: {item.quantity} {item.order_unit}
                                                </p>
                                            </div>
                                            <p className="text-sm font-medium text-gray-800 whitespace-nowrap">
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
                                                {shipping_amount === 0 ? 'Free' : `Rp${(shipping_amount as number).toLocaleString()}`}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Tax (11%)</span>
                                            <span className="font-medium">Rp{ppn.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between border-t pt-2 mt-2">
                                            <span className="text-lg font-semibold text-gray-800">Total</span>
                                            <span className="text-lg font-semibold text-gray-800">Rp{grandTotal.toLocaleString()}</span>
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