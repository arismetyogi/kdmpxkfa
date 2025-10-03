import PriceDisplay from '@/components/priceDisplay';
import ScrollToTopButton from '@/components/ScrollToTop';
import HeaderLayout from '@/layouts/header-layout';
import { type BreadcrumbItem, type CartItem, type CartItemOrPackage, type PackageItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ChevronDown, ChevronUp, Package, ShoppingBag, ShoppingBasket } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Medicines', href: '/orders/products' },
    { title: 'Cart', href: '#' },
];

export default function Cart() {
    const [cart, setCart] = useState<CartItemOrPackage[]>([]);

    useEffect(() => {
        const storedCart = localStorage.getItem('cart');
        if (storedCart) setCart(JSON.parse(storedCart));

        const message = localStorage.getItem('cartmsg');
        if (message) {
            toast.error(message);
            localStorage.removeItem('cartmsg');
        }
    }, []);

    const updateQuantity = useCallback((identifier: string, delta: number) => {
        setCart((prevCart) => {
            const updated = prevCart
                .map((item) => {
                    // Handle package items - packages can't have their quantity changed directly
                    if ('isPackage' in item && item.id === identifier) {
                        // For packages, we can't change quantity via this function, return unchanged
                        return item;
                    }
                    // Handle regular cart items
                    else if ('sku' in item && item.sku === identifier) {
                        const newQuantity = Math.max(0, item.quantity + delta);
                        return {
                            ...item,
                            quantity: newQuantity,
                            total: newQuantity * Number(item.price) * item.content,
                        };
                    }
                    return item;
                })
                .filter((item) => {
                    // Filter out items with zero quantity (except packages which can't have quantity changed this way)
                    if ('isPackage' in item) {
                        return true; // Packages are not filtered by quantity
                    } else {
                        return item.quantity > 0;
                    }
                });

            localStorage.setItem('cart', JSON.stringify(updated));
            return updated;
        });
    }, []);

    const removeItem = useCallback((identifier: string) => {
        setCart((prevCart) => {
            const updated = prevCart.filter((item) => {
                // For package items, use id; for regular items, use sku
                if ('isPackage' in item) {
                    return item.id !== identifier;
                } else {
                    return item.sku !== identifier;
                }
            });
            localStorage.setItem('cart', JSON.stringify(updated));
            return updated;
        });
    }, []);

    const clearCart = useCallback(() => {
        setCart([]);
        localStorage.removeItem('cart');
    }, []);

    // Use useMemo to calculate totals only when cart changes
    const { subtotal, ppn, grandTotal } = useMemo(() => {
        const subtotal = cart.reduce((sum, item) => {
            if ('isPackage' in item && item.isPackage) {
                // For package items, use the stored price
                return sum + item.price;
            } else {
                // For regular items, calculate price * quantity * content
                const regularItem = item as CartItem;
                return sum + regularItem.price * regularItem.quantity * (regularItem.content || 1);
            }
        }, 0);
        const ppn = subtotal * 0.11;
        const grandTotal = subtotal + ppn;
        return { subtotal, ppn, grandTotal };
    }, [cart]);

    // Component to display package items
    const PackageItemComponent = ({ item, index }: { item: PackageItem; index: number }) => {
        const [expanded, setExpanded] = useState(false);

        return (
            <div
                key={`${item.id}-${index}`} // Use id for packages
                className="flex flex-col justify-between rounded-xl border bg-card p-3 text-card-foreground shadow-md transition hover:shadow-lg sm:p-5"
            >
                {/* Package Info */}
                <div className="flex items-center gap-4 sm:gap-5">
                    <div className="relative">
                        <img
                            src={item.image || 'Package.png'}
                            alt={item.name}
                            className="h-16 w-16 rounded-lg object-cover shadow sm:h-20 sm:w-20"
                            onError={({ currentTarget }) => {
                                currentTarget.src = 'Package.png';
                            }}
                        />
                        <div className="absolute -right-1 -bottom-1 rounded-full bg-primary p-1">
                            <Package className="h-3 w-3 text-white" />
                        </div>
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center justify-between">
                            <h2 className="text-base font-semibold sm:text-lg">{item.name}</h2>
                            <button onClick={() => setExpanded(!expanded)} className="rounded-full p-1 hover:bg-gray-100">
                                {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                            </button>
                        </div>

                        <p className="text-sm text-muted-foreground">
                            {item.packageContents.length} product{item.packageContents.length !== 1 ? 's' : ''} in package
                        </p>

                        {/* Action buttons for packages */}
                        <div className="flex justify-between">
                            <PriceDisplay price={item.price * 1.11} className="mt-1 text-sm font-bold text-primary sm:text-base" />
                            <div className="flex gap-2">
                                <button
                                    onClick={() => {
                                        // Store current package in localStorage to restore on package page
                                        localStorage.setItem('editingPackage', JSON.stringify(item));
                                        // Navigate to package page
                                        window.location.href = route('packages.index');
                                    }}
                                    className="text-sm text-blue-600 hover:text-blue-800 sm:text-base"
                                >
                                    Edit Package
                                </button>
                                <button onClick={() => removeItem(item.id)} className="text-sm text-destructive hover:text-destructive/80 sm:text-base">
                                    Remove
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Package Contents (conditionally shown) */}
                {expanded && (
                    <div className="mt-4 border-t pt-4">
                        <h3 className="mb-2 font-medium">Package Contents:</h3>
                        <div className="space-y-2">
                            {item.packageContents.map((product, idx) => (
                                <div key={idx} className="flex items-center justify-between text-sm">
                                    <span>
                                        {product.quantity}x {product.name}
                                    </span>
                                    <PriceDisplay price={product.price * product.quantity * (product.content || 1)} />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    // Memoize cart items to prevent re-rendering of the entire list when possible
    const cartItems = useMemo(
        () =>
            cart.map((item, i) => {
                // Check if this is a package item
                if ('isPackage' in item && item.isPackage) {
                    return <PackageItemComponent key={`${item.id}-${i}`} item={item as PackageItem} index={i} />;
                } else {
                    // Regular cart item
                    const regularItem = item as CartItem; // Type assertion for cleaner code
                    return (
                        <div
                            key={`${regularItem.sku}-${i}`} // Better unique key that accounts for item position
                            className="flex flex-col justify-between rounded-xl border bg-card p-3 text-card-foreground shadow-md transition hover:shadow-lg sm:flex-row sm:items-center sm:p-5"
                        >
                            {/* Info Produk */}
                            <div className="flex items-center gap-4 sm:gap-5">
                                <img
                                    src={regularItem.image[0] ?? ''}
                                    alt={regularItem.name}
                                    className="h-16 w-16 rounded-lg object-cover shadow sm:h-20 sm:w-20"
                                    onError={({ currentTarget }) => {
                                        currentTarget.src = '/products/Placeholder_Medicine.png';
                                    }}
                                />
                                <div>
                                    <h2 className="text-base font-semibold sm:text-lg">{regularItem.name}</h2>
                                    <p className="text-sm text-muted-foreground">
                                        {regularItem.weight} gram / {regularItem.order_unit}
                                    </p>
                                    {/* UPDATED PRICE DISPLAY */}
                                    <PriceDisplay
                                        price={regularItem.price * (regularItem.content || 1)}
                                        className="mt-1 text-sm font-bold text-primary sm:text-base"
                                    />
                                </div>
                            </div>

                            {/* Quantity & Actions */}
                            <div className="mt-4 flex items-center gap-3 sm:mt-0">
                                <button
                                    onClick={() => updateQuantity(regularItem.sku, -1)}
                                    className="rounded-4xl border-1 bg-primary-foreground px-3 py-1.5 font-bold transition hover:bg-primary/80"
                                    disabled={regularItem.quantity <= 1} // Prevent quantity from going below 1
                                >
                                    -
                                </button>
                                <span className="text-lg font-semibold text-primary">{regularItem.quantity}</span>
                                <button
                                    onClick={() => updateQuantity(regularItem.sku, 1)}
                                    className="rounded-4xl border-1 bg-primary-foreground px-3 py-1.5 font-bold transition hover:bg-primary/80"
                                >
                                    +
                                </button>
                                <button
                                    onClick={() => removeItem(regularItem.sku)}
                                    className="ml-3 text-sm text-destructive hover:text-destructive/80 sm:text-base"
                                >
                                    Hapus
                                </button>
                            </div>
                        </div>
                    );
                }
            }),
        [cart, updateQuantity, removeItem],
    );

    return (
        <HeaderLayout breadcrumbs={breadcrumbs}>
            <Head title="Cart" />
            <div className="p-4 sm:p-6">
                {/* Header */}
                <div className="mb-6 flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
                    <h1 className="flex gap-3 text-2xl font-bold tracking-tight text-primary sm:text-3xl">
                        <ShoppingBasket size={36} />
                        Keranjang Belanja
                    </h1>
                    {cart.length > 0 && (
                        <button
                            onClick={clearCart}
                            className="rounded-lg px-4 py-2 text-sm text-destructive transition hover:bg-destructive/10 sm:text-base"
                        >
                            Hapus Semua
                        </button>
                    )}
                </div>

                {/* Empty State */}
                {cart.length === 0 ? (
                    <div className="flex h-72 flex-col items-center justify-center rounded-2xl px-4 text-center text-muted-foreground">
                        <ShoppingBag size={80} className="mb-6 opacity-50" />
                        <p className="mb-4 text-lg font-semibold sm:text-xl">Keranjang masih kosong</p>
                        <Link href={route('orders.products')} className="w-full max-w-xs">
                            <button className="hover:primary/90 w-full rounded-xl bg-primary px-6 py-3 font-medium text-primary-foreground shadow-md transition">
                                Mulai Belanja
                            </button>
                        </Link>
                    </div>
                ) : (
                    <>
                        {/* Main content grid with adjusted padding */}
                        <div className="grid grid-cols-1 gap-8 pb-32 lg:grid-cols-3 lg:pb-0">
                            {/* Daftar Pesanan */}
                            <div className="space-y-4 lg:col-span-2">{cartItems}</div>

                            {/* Ringkasan Belanja (Desktop View) */}
                            <div className="hidden self-start rounded-2xl border bg-card p-6 text-card-foreground shadow-lg lg:sticky lg:top-20 lg:block">
                                <h2 className="mb-5 text-xl font-bold">Ringkasan Belanja</h2>
                                <div className="space-y-3 text-sm sm:text-base">
                                    <div className="flex justify-between text-muted-foreground">
                                        <span>Subtotal</span>
                                        {/* UPDATED SUBTOTAL DISPLAY */}
                                        <PriceDisplay price={subtotal} />
                                    </div>
                                    <div className="flex justify-between text-muted-foreground">
                                        <span>PPN (11%)</span>
                                        {/* UPDATED PPN DISPLAY */}
                                        <PriceDisplay price={ppn} />
                                    </div>
                                    <div className="mt-3 flex justify-between border-t pt-3 text-lg font-bold text-primary sm:text-xl">
                                        <span>Total</span>
                                        {/* UPDATED GRAND TOTAL DISPLAY */}
                                        <PriceDisplay price={grandTotal} />
                                    </div>
                                </div>
                                <div className="mt-8">
                                    <Link href={route('checkout')}>
                                        <button className="w-full rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground shadow-md transition hover:bg-primary/90">
                                            Cetak Purchase Order
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Redesigned Mobile Sticky Footer */}
                        {cart.length > 0 && (
                            <div className="fixed right-0 bottom-0 left-0 block border-t bg-card px-4 pt-3 pb-4 shadow-[0_-4px_10px_-1px_rgba(0,0,0,0.05)] lg:hidden">
                                <div className="mx-auto flex max-w-screen-xl flex-col items-center gap-3">
                                    {/* Total Information - Now a vertical flex column */}
                                    <div className="flex flex-col items-center">
                                        <span className="text-sm text-muted-foreground">Total Belanja</span>
                                        <PriceDisplay price={grandTotal} className="text-xl font-bold text-primary" />
                                    </div>

                                    {/* Checkout Button */}
                                    <Link href={route('checkout')} className="w-full max-w-sm">
                                        <button className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-md transition hover:bg-primary/90">
                                            Cetak Purchase Order
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
            <ScrollToTopButton PC />
        </HeaderLayout>
    );
}
