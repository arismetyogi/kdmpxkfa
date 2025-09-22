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
    const [paymentType, setPaymentType] = useState('CAD');
    const [isProcessing, setIsProcessing] = useState(false);
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    
    const storedData = localStorage.getItem('creditLimitData') || 'null';
    const parsedData = JSON.parse(storedData);
    const creditLimit = parsedData?.creditLimit ?? 0; // Added nullish coalescing for safety
    

    useEffect(() => {
        const storedCart = localStorage.getItem("cart");
        if (!storedCart){
            localStorage.setItem("cartmsg", "Your cart is empty.");
            window.location.href = route('cart');
        } else
        setCartItems(JSON.parse(storedCart));
    }, []);

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
                {/* --- THEME CHANGE #1: Use foreground for main title --- */}
                <h1 className="mb-8 text-2xl font-bold text-foreground">Payment</h1>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {/* Payment Methods */}
                    <div className="lg:col-span-2">
                        {/* The `Card` component is already themed */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Payment Method</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    {/* Mandiri (Disabled) - THEME CHANGE #2: Use theme colors */}
                                    <div className="cursor-not-allowed rounded-xl p-4 flex items-center justify-between border-2 border-border opacity-50">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-yellow-400 p-3 rounded-full">
                                                <CreditCard className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-card-foreground">Bank Mandiri</h3>
                                                <p className="text-sm text-muted-foreground">Virtual Account</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* BCA (Disabled) - THEME CHANGE #3: Use theme colors */}
                                    <div className="cursor-not-allowed rounded-xl p-4 flex items-center justify-between border-2 border-border opacity-50">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-blue-500 p-3 rounded-full">
                                                <CreditCard className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-card-foreground">Bank BCA</h3>
                                                <p className="text-sm text-muted-foreground">Virtual Account</p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* pinjaman Koperasi (Enabled) - THEME CHANGE #4: Use theme colors for selected state */}
                                    <div
                                        className={`rounded-xl p-4 flex flex-col gap-3 border-2 transition-all duration-200 ${
                                            sourceOfFund === 'pinjaman' ? 'border-primary bg-primary/10' : 'border-border'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            {/* --- THEME CHANGE #5: Use secondary for the icon background --- */}
                                            <div className="bg-secondary p-3 rounded-full">
                                                <Wallet className="w-6 h-6 text-secondary-foreground" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-card-foreground">Kredit Koperasi</h3>
                                                <p className="text-sm text-muted-foreground">
                                                    Remaining Credits: Rp {creditLimit.toLocaleString()}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mt-2 pl-12">
                                            <Label className="mb-2 block font-medium">Payment Type</Label>
                                            {/* The `Select` component is already themed */}
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
                                        {/* --- THEME CHANGE #6: Use primary colors for the button --- */}
                                        <button
                                            type="submit"
                                            disabled={isProcessing}
                                            className="w-full rounded-md bg-primary px-4 py-3 text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                                        >
                                            {isProcessing ? 'Processing...' : 'Place Order'}
                                        </button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>

                        {/* Billing & Shipping Info - THEME CHANGE #7: Use card colors */}
                        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                             <div className="rounded-lg bg-card text-card-foreground p-6 shadow-sm">
                                <h3 className="mb-3 text-md font-semibold">Billing Address</h3>
                                <div className="text-sm text-muted-foreground space-y-1">
                                    <p className="text-card-foreground">
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

                            <div className="rounded-lg bg-card text-card-foreground p-6 shadow-sm">
                                <h3 className="text-md mb-3 font-semibold">Shipping Address</h3>
                                <div className="text-sm text-muted-foreground space-y-1">
                                    <p className="text-card-foreground">
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

                    {/* Order Summary - THEME CHANGE #8: Use card colors */}
                    <div className="lg:col-span-1">
                        <div className="rounded-lg bg-card text-card-foreground p-6 shadow-sm">
                            <h2 className="mb-4 text-lg font-semibold">Order Summary</h2>
                            <div className="space-y-4">
                                <div className="max-h-60 overflow-y-auto pr-2">
                                    {cartItems.map((item) => (
                                        <div key={item.id} className="flex items-start justify-between py-2">
                                            <div className='flex-1'>
                                                <p className="text-sm font-medium">{item.name}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    Qty: {item.quantity} {item.order_unit}
                                                </p>
                                            </div>
                                            <p className="text-sm font-medium whitespace-nowrap">
                                                Rp{(item.price * item.quantity).toLocaleString()}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                <div className="border-t border-border pt-4">
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Subtotal</span>
                                            <span className="font-medium">Rp{subtotal.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Shipping</span>
                                            {/* --- THEME CHANGE #9: Make "Free" text readable in dark mode --- */}
                                            <span className="font-medium text-green-600 dark:text-green-400">
                                                {shipping_amount === 0 ? 'Free' : `Rp${(shipping_amount as number).toLocaleString()}`}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Tax (11%)</span>
                                            <span className="font-medium">Rp{ppn.toLocaleString()}</span>
                                        </div>
                                        {/* --- THEME CHANGE #10: Use primary color for the total --- */}
                                        <div className="flex justify-between border-t border-border pt-2 mt-2">
                                            <span className="text-lg font-semibold text-primary">Total</span>
                                            <span className="text-lg font-semibold text-primary">Rp{grandTotal.toLocaleString()}</span>
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