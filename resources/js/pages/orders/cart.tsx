import HeaderLayout from '@/layouts/header-layout';
import { type BreadcrumbItem, type CartItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ShoppingBag, ShoppingBasket } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Medicines', href: '/orders/products' },
    { title: 'Cart', href: '#' },
];

export default function Cart() {
    const [cart, setCart] = useState<CartItem[]>([]);

    useEffect(() => {
        const storedCart = localStorage.getItem('cart');
        if (storedCart) setCart(JSON.parse(storedCart));

        const message = localStorage.getItem('cartmsg');
        if (message) {
            toast.error(message);
            localStorage.removeItem('cartmsg');
        }
    }, []);

    const updateQuantity = (sku: string, delta: number) => {
        const updated = cart
            .map((item) =>
                item.sku === sku
                    ? {
                          ...item,
                          quantity: Math.max(0, item.quantity + delta),
                          total: Math.max(0, item.quantity + delta) * Number(item.price),
                      }
                    : item,
            )
            .filter((item) => item.quantity > 0);

        setCart(updated);
        localStorage.setItem('cart', JSON.stringify(updated));
    };

    const removeItem = (sku: string) => {
        const updated = cart.filter((item) => item.sku !== sku);
        setCart(updated);
        localStorage.setItem('cart', JSON.stringify(updated));
    };

    const clearCart = () => {
        setCart([]);
        localStorage.removeItem('cart');
    };

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const ppn = subtotal * 0.11;
    const grandTotal = subtotal + ppn;

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
                            <button className="w-full rounded-xl bg-blue-600 px-6 py-3 font-medium text-primary-foreground shadow-md transition hover:bg-blue-600/90">
                                Mulai Belanja
                            </button>
                        </Link>
                    </div>
                ) : (
                    <>
                        {/* Main content grid with adjusted padding */}
                        <div className="grid grid-cols-1 gap-8 pb-32 lg:grid-cols-3 lg:pb-0">
                            {/* Daftar Pesanan */}
                            <div className="space-y-4 lg:col-span-2">
                                {cart.map((item, i) => (
                                    <div
                                        key={i}
                                        className="flex flex-col justify-between rounded-xl border bg-card p-3 text-card-foreground shadow-md transition hover:shadow-lg sm:flex-row sm:items-center sm:p-5"
                                    >
                                        {/* Info Produk */}
                                        <div className="flex items-center gap-4 sm:gap-5">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="h-16 w-16 rounded-lg object-cover shadow sm:h-20 sm:w-20"
                                            />
                                            <div>
                                                <h2 className="text-base font-semibold sm:text-lg">{item.name}</h2>
                                                <p className="text-sm text-muted-foreground">
                                                    {item.weight} gram / {item.order_unit}
                                                </p>
                                                <p className="mt-1 text-sm font-bold text-primary sm:text-base">
                                                    Rp {(item.price ?? 0).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Quantity & Actions */}
                                        <div className="mt-4 flex items-center gap-3 sm:mt-0">
                                            <button
                                                onClick={() => updateQuantity(item.sku, -1)}
                                                className="rounded-4xl border-1 bg-primary-foreground px-3 py-1.5 font-bold transition hover:bg-primary/80"
                                            >
                                                -
                                            </button>
                                            <span className="text-lg font-semibold text-primary">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.sku, 1)}
                                                className="rounded-4xl border-1 bg-primary-foreground px-3 py-1.5 font-bold transition hover:bg-primary/80"
                                            >
                                                +
                                            </button>
                                            <button
                                                onClick={() => removeItem(item.sku)}
                                                className="ml-3 text-sm text-destructive hover:text-destructive/80 sm:text-base"
                                            >
                                                Hapus
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Ringkasan Belanja (Desktop View) */}
                            <div className="hidden self-start rounded-2xl border bg-card p-6 text-card-foreground shadow-lg lg:sticky lg:top-20 lg:block">
                                <h2 className="mb-5 text-xl font-bold">Ringkasan Belanja</h2>
                                <div className="space-y-3 text-sm sm:text-base">
                                    <div className="flex justify-between text-muted-foreground">
                                        <span>Subtotal</span>
                                        <span>Rp {subtotal.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-muted-foreground">
                                        <span>PPN (11%)</span>
                                        <span>Rp {ppn.toLocaleString()}</span>
                                    </div>
                                    <div className="mt-3 flex justify-between border-t pt-3 text-lg font-bold text-primary sm:text-xl">
                                        <span>Total</span>
                                        <span>Rp {grandTotal.toLocaleString()}</span>
                                    </div>
                                </div>
                                <div className="mt-8">
                                    <Link href={route('checkout')}>
                                        <button className="w-full rounded-xl bg-blue-600 px-6 py-3 font-semibold text-primary-foreground shadow-md transition hover:bg-blue-600/90">
                                            Cetak Purchase Order
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Redesigned Mobile Sticky Footer */}
                        {cart.length > 0 && (
                            <div className="fixed right-0 bottom-0 left-0 block border-t bg-card px-4 pt-2 pb-3 shadow-[0_-4px_10px_-1px_rgba(0,0,0,0.05)] lg:hidden">
                                <div className="mx-auto flex max-w-screen-xl flex-col items-center gap-2">
                                    {/* Total Information */}
                                    <div className="text-center">
                                        <span className="text-xs text-muted-foreground">Total Belanja</span>
                                        <p className="text-lg font-bold text-primary">Rp {grandTotal.toLocaleString()}</p>
                                    </div>

                                    {/* Checkout Button */}
                                    <Link href={route('checkout')} className="w-full max-w-sm">
                                        <button className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-primary-foreground shadow-md transition hover:bg-blue-600/90">
                                            Cetak Purchase Order
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </HeaderLayout>
    );
}
