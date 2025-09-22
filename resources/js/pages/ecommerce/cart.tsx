import HeaderLayout from '@/layouts/header-layout';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Minus, Plus, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { BreadcrumbItem } from '@/types';
import { toast } from 'sonner';

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

interface CartProps {
    cartItems: CartItem[];
    cartCount: number;
}

export default function CartPage({ cartItems, cartCount }: CartProps) {
    const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set());

    const updateQuantity = (item: CartItem, newQuantity: number) => {
        if (newQuantity < 1) return;

        const itemKey = `${item.product_id}`;
        setUpdatingItems((prev) => new Set(prev).add(itemKey));

        router.put(
            route('carts.update', { product: item.product_id }),
            {
                quantity: newQuantity,
            },
            {
                onFinish: () => {
                    setUpdatingItems((prev) => {
                        const newSet = new Set(prev);
                        newSet.delete(itemKey);
                        return newSet;
                    });
                },
            },
        );
    };

    const removeItem = (item: CartItem) => {
        router.delete(route('carts.delete', { product: item.product_id }));
    };

    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = 0; // Free shipping
    const total = subtotal + shipping;

    const handleCheckout = () => {
        router.get(route('checkout'));
    };

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: route('dashboard'),
        },
    ];

const message = localStorage.getItem("cartmsg");
console.log(message);
useEffect(() => {
  if (message) {
    toast.error(message);
    localStorage.removeItem("cartRedirectMessage");
    console.log(message)
  }
});

    if (cartItems.length === 0) {
        return (
            <HeaderLayout>
                <Head title="Carts" />
                <div className="container mx-auto px-4 py-8">
                    <div className="text-center">
                        <div className="mb-6">
                            <svg className="mx-auto h-24 w-24 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m6 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"
                                />
                            </svg>
                        </div>
                        <h2 className="mb-4 text-2xl font-bold text-gray-800">Your cart is empty</h2>
                        <p className="mb-8 text-gray-600">Looks like you haven't added any items to your cart yet.</p>
                        <Link href="/" className="inline-flex items-center rounded-md bg-indigo-600 px-6 py-3 text-white hover:bg-indigo-700">
                            <ArrowLeft className="mr-2 h-5 w-5" />
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </HeaderLayout>
        );
    }

    return (
        <HeaderLayout breadcrumbs={breadcrumbs}>
            <Head title="Carts" />
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {/* Cart Items */}
                    <div className="lg:col-span-2">
                        <div className="rounded-lg bg-white shadow-sm">
                            <div className="border-b px-6 py-4">
                                <h1 className="text-xl font-semibold text-gray-800">Shopping Cart ({cartCount} items)</h1>
                            </div>
                            <div className="divide-y">
                                {cartItems.map((item) => {
                                    const itemKey = `${item.product_id}`;
                                    const isUpdating = updatingItems.has(itemKey);

                                    return (
                                        <div key={itemKey} className="p-6">
                                            <div className="flex items-center">
                                                <img src={item.image} alt={item.name} className="h-20 w-20 rounded-md object-cover" />
                                                <div className="ml-4 flex-1">
                                                    <h3 className="text-lg font-medium text-gray-800">
                                                        <Link
                                                            // href={route('product.detail', { slug: item.slug })}
                                                            className="hover:text-indigo-600"
                                                        >
                                                            {item.name}
                                                        </Link>
                                                    </h3>
                                                    <div className="mt-1 text-sm text-gray-600">
                                                        {item.content} {item.base_uom} per {item.order_unit}
                                                    </div>
                                                    <div className="mt-1 text-sm font-medium text-gray-600">
                                                        {item.quantity} {item.order_unit}
                                                        <span className="text-gray-500">
                                                            {' '}
                                                            ({item.quantity * item.content} {item.base_uom})
                                                        </span>
                                                    </div>
                                                    <div className="mt-2 text-lg font-semibold text-indigo-600">
                                                        Rp{item.price.toLocaleString()}
                                                        <span className="text-sm font-normal text-gray-500"> per {item.order_unit}</span>
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        Rp{item.base_price.toLocaleString()} per {item.base_uom}
                                                    </div>
                                                </div>
                                                <div className="ml-4 flex items-center space-x-2">
                                                    <button
                                                        onClick={() => updateQuantity(item, item.quantity - 1)}
                                                        disabled={isUpdating}
                                                        className="rounded-md border p-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                                                    >
                                                        <Minus className="h-4 w-4" />
                                                    </button>
                                                    <span className="w-12 text-center text-gray-800">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item, item.quantity + 1)}
                                                        disabled={isUpdating}
                                                        className="rounded-md border p-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                                                    >
                                                        <Plus className="h-4 w-4" />
                                                    </button>
                                                </div>
                                                <div className="ml-4 text-right">
                                                    <div className="text-lg font-semibold text-gray-800">
                                                        Rp{(item.price * item.quantity).toLocaleString()}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        ({item.base_price * item.quantity * item.content} {item.base_uom})
                                                    </div>
                                                    <button onClick={() => removeItem(item)} className="mt-2 text-sm text-red-600 hover:text-red-800">
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="rounded-lg bg-white p-6 shadow-sm">
                            <h2 className="mb-4 text-lg font-semibold text-gray-800">Order Summary</h2>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="font-medium">Rp{subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Shipping</span>
                                    <span className="font-medium text-green-600">Free</span>
                                </div>
                                <div className="border-t pt-3">
                                    <div className="flex justify-between">
                                        <span className="text-lg font-semibold text-gray-800">Total</span>
                                        <span className="text-lg font-semibold text-gray-800">Rp{total.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={handleCheckout}
                                className="mt-6 w-full rounded-md bg-indigo-600 px-4 py-3 text-white hover:bg-indigo-700"
                            >
                                Proceed to Checkout
                            </button>
                            <Link
                                href={route('orders.products')}
                                className="mt-3 block w-full rounded-md border border-gray-300 px-4 py-3 text-center text-gray-700 hover:bg-gray-50"
                            >
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </HeaderLayout>
    );
}
