import PriceDisplay from '@/components/priceDisplay';
import ScrollToTopButton from '@/components/ScrollToTop';
import { useCart } from '@/context/CartContext';
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
    const { updateCartFromStorage } = useCart();

    useEffect(() => {
        const loadCart = () => {
            const storedCart = localStorage.getItem('cart');
            if (storedCart) setCart(JSON.parse(storedCart));
            else setCart([]);
        };

        loadCart(); // initial load
        updateCartFromStorage(); // also update context cart count

        const message = localStorage.getItem('cartmsg');
        if (message) {
            toast.error(message);
            localStorage.removeItem('cartmsg');
        }

        // ✅ Listen to cart updates (so if other tab or component changes cart, it syncs)
        const handleCartUpdate = () => loadCart();
        window.addEventListener('cart-updated', handleCartUpdate);
        window.addEventListener('storage', handleCartUpdate);

        return () => {
            window.removeEventListener('cart-updated', handleCartUpdate);
            window.removeEventListener('storage', handleCartUpdate);
        };
    }, [updateCartFromStorage]);

    const updateQuantity = useCallback((identifier: string, delta: number) => {
        setCart((prevCart) => {
            const updated = prevCart
                .map((item) => {
                    if ('isPackage' in item) {
                        return item;
                    } else if ('sku' in item && item.sku === identifier) {
                        const newQuantity = Math.max(1, item.quantity + delta); // Enforce a minimum quantity of 1
                        return {
                            ...item,
                            quantity: newQuantity,
                            total: newQuantity * Number(item.price) * (item.content || 1),
                        };
                    }
                    return item;
                })
                .filter((item) => ('isPackage' in item ? true : item.quantity > 0));

            localStorage.setItem('cart', JSON.stringify(updated));
            window.dispatchEvent(new Event('cart-updated'));
            return updated;
        });
    }, []);

    const setItemQuantity = useCallback((identifier: string, quantity: number) => {
        setCart((prevCart) => {
            const updated = prevCart.map((item) => {
                if ('sku' in item && item.sku === identifier) {
                    // If quantity is invalid (e.g., from empty input), default to 1. Otherwise, use the new quantity.
                    const newQuantity = isNaN(quantity) || quantity < 1 ? 1 : quantity;
                    return {
                        ...item,
                        quantity: newQuantity,
                        total: newQuantity * Number(item.price) * (item.content || 1),
                    };
                }
                return item;
            });
            localStorage.setItem('cart', JSON.stringify(updated));
            window.dispatchEvent(new Event('cart-updated'));
            return updated;
        });
    }, []);

    const removeItem = useCallback((identifier: string) => {
        setCart((prevCart) => {
            const updated = prevCart.filter((item) => {
                if ('isPackage' in item) {
                    return item.id !== identifier;
                } else {
                    return item.sku !== identifier;
                }
            });
            localStorage.setItem('cart', JSON.stringify(updated));
            window.dispatchEvent(new Event('cart-updated'));
            return updated;
        });
    }, []);

    const clearCart = useCallback(() => {
        setCart([]);
        localStorage.removeItem('cart');
        window.dispatchEvent(new Event('cart-updated'));
    }, []);

    const { subtotal, ppn, grandTotal } = useMemo(() => {
        const subtotal = cart.reduce((sum, item) => {
            if ('isPackage' in item && item.isPackage) {
                return sum + item.price;
            } else {
                const regularItem = item as CartItem;
                return sum + regularItem.price * regularItem.quantity * (regularItem.content || 1);
            }
        }, 0);
        const ppn = subtotal * 0.11;
        const grandTotal = subtotal + ppn;
        return { subtotal, ppn, grandTotal };
    }, [cart]);

    const PackageItemComponent = ({ item, index }: { item: PackageItem; index: number }) => {
        const [expanded, setExpanded] = useState(false);

        return (
            <div
                key={`${item.id}-${index}`}
                className="flex flex-col justify-between rounded-xl border bg-card p-3 text-card-foreground shadow-md transition hover:shadow-lg sm:p-5"
            >
                <div className="flex items-center gap-4 sm:gap-5">
                    <div className="relative">
                        <img
                            src={item.image || 'Package (2).png'}
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

                        <div className="flex justify-between">
                            <PriceDisplay price={item.price * 1.11} className="mt-1 text-sm font-bold text-primary sm:text-base" />
                            <div className="flex gap-2">
                                <button
                                    onClick={() => {
                                        localStorage.setItem('editingPackage', JSON.stringify(item));
                                        window.location.href = route('packages.index');
                                    }}
                                    className="text-sm text-blue-600 hover:text-blue-800 sm:text-base"
                                >
                                    Edit Package
                                </button>
                                <button
                                    onClick={() => removeItem(item.id)}
                                    className="text-sm text-destructive hover:text-destructive/80 sm:text-base"
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

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

    const cartItems = useMemo(
        () =>
            cart.map((item, i) => {
                if ('isPackage' in item && item.isPackage) {
                    return <PackageItemComponent key={`${item.id}-${i}`} item={item as PackageItem} index={i} />;
                } else {
                    const regularItem = item as CartItem;
                    return (
                        <div
                            key={`${regularItem.sku}-${i}`}
                            className="flex flex-col justify-between rounded-xl border bg-card p-3 text-card-foreground shadow-md transition hover:shadow-lg sm:flex-row sm:items-center sm:p-5"
                        >
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
                                    <PriceDisplay
                                        price={regularItem.price * (regularItem.content || 1)}
                                        className="mt-1 text-sm font-bold text-primary sm:text-base"
                                    />
                                </div>
                            </div>

                            {/* Quantity & Actions */}
                            <div className="mt-4 flex items-center justify-end gap-2 sm:mt-0 sm:justify-start">
                                <button
                                    onClick={() => updateQuantity(regularItem.sku, -1)}
                                    className="flex h-8 w-8 items-center justify-center rounded-full border bg-background text-lg font-bold transition hover:bg-muted"
                                    disabled={regularItem.quantity <= 1}
                                >
                                    -
                                </button>
                                <input
                                    value={regularItem.quantity}
                                    min={1}
                                    onChange={(e) => {
                                        const num = parseInt(e.target.value, 10);
                                        setItemQuantity(regularItem.sku, num);
                                    }}
                                    className="w-8 rounded-md border-0 bg-transparent text-center text-lg font-semibold text-primary focus:ring-0 focus:outline-none"
                                    aria-label={`Quantity for ${regularItem.name}`}
                                />
                                <button
                                    onClick={() => updateQuantity(regularItem.sku, 1)}
                                    className="flex h-8 w-8 items-center justify-center rounded-full border bg-background text-lg font-bold transition hover:bg-muted"
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
        [cart, updateQuantity, removeItem, setItemQuantity],
    );

    return (
        <HeaderLayout breadcrumbs={breadcrumbs}>
            <Head title="Cart" />
            <div className="p-4 sm:p-6">
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
                        <div className="grid grid-cols-1 gap-8 pb-32 lg:grid-cols-3 lg:pb-0">
                            <div className="space-y-4 lg:col-span-2">{cartItems}</div>

                            <div className="hidden self-start rounded-2xl border bg-card p-6 text-card-foreground shadow-lg lg:sticky lg:top-20 lg:block">
                                <h2 className="mb-5 text-xl font-bold">Ringkasan Belanja</h2>
                                <div className="space-y-3 text-sm sm:text-base">
                                    <div className="flex justify-between text-muted-foreground">
                                        <span>Subtotal</span>
                                        <PriceDisplay price={subtotal} />
                                    </div>
                                    <div className="flex justify-between text-muted-foreground">
                                        <span>PPN (11%)</span>
                                        <PriceDisplay price={ppn} />
                                    </div>
                                    <div className="mt-3 flex justify-between border-t pt-3 text-lg font-bold text-primary sm:text-xl">
                                        <span>Total</span>
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

                        {cart.length > 0 && (
                            <div className="fixed right-0 bottom-0 left-0 block border-t bg-card px-4 pt-3 pb-4 shadow-[0_-4px_10px_-1px_rgba(0,0,0,0.05)] lg:hidden">
                                <div className="mx-auto flex max-w-screen-xl flex-col items-center gap-3">
                                    <div className="flex flex-col items-center">
                                        <span className="text-sm text-muted-foreground">Total Belanja</span>
                                        <PriceDisplay price={grandTotal} className="text-xl font-bold text-primary" />
                                    </div>

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
