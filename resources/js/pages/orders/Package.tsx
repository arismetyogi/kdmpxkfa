import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import HeaderLayout from '@/layouts/header-layout';
import { CartItem, Product, type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Minus, Plus, ShoppingCart } from 'lucide-react';
import { useEffect, useState } from 'react';

interface PackageProduct extends Product {
    assignedQuantity: number;
    maxQuantity: number;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Packages', href: '/packages' },
    { title: 'Health Package', href: '#' },
];

interface PackagePageProps {
    products: PackageProduct[];
}

export default function PackagePage({ products: initialProducts }: PackagePageProps) {
    const [packageProducts, setPackageProducts] = useState<PackageProduct[]>(initialProducts);
    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    useEffect(() => {
        const storedCart = localStorage.getItem('cart');
        if (storedCart) {
            setCartItems(JSON.parse(storedCart));
        }

        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'cart' && e.newValue) {
                setCartItems(JSON.parse(e.newValue));
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const updateQuantity = (productId: number, newQuantity: number) => {
        setPackageProducts((prevProducts) =>
            prevProducts.map((product) =>
                product.id === productId ? { ...product, assignedQuantity: Math.max(1, Math.min(newQuantity, product.maxQuantity)) } : product,
            ),
        );
    };

    const calculateSubtotal = (product: PackageProduct) => {
        return product.price * product.assignedQuantity;
    };

    const calculateSubtotalAll = () => {
        return packageProducts.reduce((total, product) => {
            return total + product.price * product.assignedQuantity;
        }, 0);
    };

    const calculateTax = () => {
        return calculateSubtotalAll() * 0.11;
    };

    const calculateTotalPrice = () => {
        return calculateSubtotalAll() + calculateTax();
    };

    const currency = (value: number | undefined) => {
        if (value === undefined) return 'Rp 0';
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        }).format(value);
    };

    const addToCheckout = () => {
        try {
            // Clear existing cart items in localStorage
            localStorage.removeItem('cart');

            // Create new cart with only package products
            const cart: CartItem[] = [];

            // Add all package products to cart
            packageProducts.forEach((product) => {
                const newItem: CartItem = {
                    ...product,
                    quantity: product.assignedQuantity,
                    total: product.price * product.assignedQuantity,
                };

                // Add new item to cart
                cart.push(newItem);
            });

            // Update localStorage
            localStorage.setItem('cart', JSON.stringify(cart));

            // Update state to trigger UI refresh
            setCartItems(cart);

            // Redirect to cart page
            router.visit(route('cart'));
        } catch (error) {
            console.error('Error adding products to cart:', error);
            alert('There was an error adding products to your cart. Please try again.');
        }
    };

    return (
        <HeaderLayout breadcrumbs={breadcrumbs}>
            <Head title="Health Package" />

            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="flex flex-col gap-8 lg:flex-row">
                    {/* Left Column - Package Info and Product List */}
                    <div className="lg:w-2/3">
                        {/* Package Info Card - Full Width */}
                        <Card className="mb-8 w-full">
                            <CardContent className="p-6">
                                <div className="mb-4">
                                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Complete Health Package</h1>
                                    <p className="mt-2 text-gray-600 dark:text-gray-300">
                                        A comprehensive package of essential health products for your family. This package includes vitamins,
                                        supplements, and common medications. You can adjust the quantity of each product between 1 and the maximum
                                        limit.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="grid grid-cols-1 gap-6">
                            {packageProducts.map((product) => (
                                <Card key={product.id} className="overflow-hidden">
                                    <CardContent className="p-6">
                                        <div className="flex flex-col gap-6 sm:flex-row">
                                            {/* Product Image */}
                                            <div className="flex-shrink-0">
                                                <div className="flex h-24 w-24 items-center justify-center rounded-xl border-2 border-dashed bg-gray-200">
                                                    {product.image ? (
                                                        <img
                                                            src={product.image}
                                                            alt={product.name}
                                                            className="h-full w-full rounded-md object-cover"
                                                        />
                                                    ) : (
                                                        <ShoppingCart className="h-8 w-8 text-gray-400" />
                                                    )}
                                                </div>
                                            </div>

                                            {/* Product Details */}
                                            <div className="flex-grow">
                                                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                                                    <div>
                                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{product.name}</h3>
                                                        <p className="mt-1 line-clamp-2 text-sm text-gray-500 dark:text-gray-400">
                                                            {product.description}
                                                        </p>
                                                        <p className="mt-2 text-lg font-medium text-blue-600 dark:text-blue-400">
                                                            {currency(product.price)}
                                                        </p>
                                                    </div>

                                                    {/* Quantity Controls */}
                                                    <div className="mt-4 flex items-center sm:mt-0">
                                                        <div className="flex items-center rounded-md border border-gray-300">
                                                            <button
                                                                onClick={() => updateQuantity(product.id, product.assignedQuantity - 1)}
                                                                disabled={product.assignedQuantity <= 1}
                                                                className={`p-2 ${
                                                                    product.assignedQuantity <= 1
                                                                        ? 'cursor-not-allowed text-gray-300'
                                                                        : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
                                                                }`}
                                                                aria-label="Decrease quantity"
                                                            >
                                                                <Minus className="h-4 w-4" />
                                                            </button>

                                                            <span className="px-3 py-2 text-sm font-medium">{product.assignedQuantity}</span>

                                                            <button
                                                                onClick={() => updateQuantity(product.id, product.assignedQuantity + 1)}
                                                                disabled={product.assignedQuantity >= product.maxQuantity}
                                                                className={`p-2 ${
                                                                    product.assignedQuantity >= product.maxQuantity
                                                                        ? 'cursor-not-allowed text-gray-300'
                                                                        : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
                                                                }`}
                                                                aria-label="Increase quantity"
                                                            >
                                                                <Plus className="h-4 w-4" />
                                                            </button>
                                                        </div>

                                                        <span className="ml-3 text-sm text-gray-500 dark:text-gray-400">
                                                            Max: {product.maxQuantity}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="mt-4 flex items-center justify-between">
                                                    <div className="text-sm">
                                                        <span className="text-gray-500 dark:text-gray-400">Subtotal: </span>
                                                        <span className="font-medium text-gray-900 dark:text-white">
                                                            {currency(calculateSubtotal(product))}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* Right Column - Order Summary */}
                    <div className="lg:w-1/3">
                        <div className="sticky top-8">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-xl">Order Summary</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ScrollArea className="h-96 pr-4">
                                        <div className="space-y-4">
                                            {packageProducts.map((product) => (
                                                <div key={product.id} className="flex items-start justify-between">
                                                    <div>
                                                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">{product.name}</h4>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">Qty: {product.assignedQuantity}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                            {currency(calculateSubtotal(product))}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </ScrollArea>

                                    <div className="mt-6 border-t border-gray-200 pt-4 dark:border-gray-700">
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <p>Subtotal</p>
                                                <p>{currency(calculateSubtotalAll())}</p>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <p>Tax (11%)</p>
                                                <p>{currency(calculateTax())}</p>
                                            </div>
                                            <div className="flex justify-between border-t border-gray-200 pt-2 text-base font-medium text-gray-900 dark:border-gray-700 dark:text-white">
                                                <p>Total</p>
                                                <p>{currency(calculateTotalPrice())}</p>
                                            </div>
                                        </div>

                                        <Button onClick={addToCheckout} className="mt-6 w-full bg-blue-600 py-3 text-white hover:bg-blue-700">
                                            <ShoppingCart className="mr-2 h-5 w-5" />
                                            Add to Checkout
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </HeaderLayout>
    );
}
