import PriceDisplay from '@/components/priceDisplay';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import HeaderLayout from '@/layouts/header-layout';
import { currency } from '@/lib/utils';
import type { Apotek, BreadcrumbItem, Order } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { format } from 'date-fns';
import { ArrowLeft, ArrowRight, CheckCircle, Package, ShoppingBag, Truck } from 'lucide-react';
import React from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Order History', href: '/orders/history' },
    { title: 'Order Detail', href: '#' },
];

type TimelineItem = { key: string; label: string; time: string | null };

export default function Detail() {
    const { order, timeline, apotek } = usePage<{
        order: Order;
        timeline: TimelineItem[];
        apotek: Apotek;
    }>().props;

    const formatTime = (time: string | null) => {
        if (!time) return '-';
        try {
            return format(new Date(time), 'dd/MM/yyyy HH:mm');
        } catch {
            return time;
        }
    };

    const stepIndexByStatus: Record<string, number> = {
        dibuat: 0,
        diproses: 1,
        'dalam-pengiriman': 2,
        diterima: 3,
    };
    const activeIndex = stepIndexByStatus[order.status] ?? 0;
    const shipping = Number(order.shipping_amount) || 0;
    const discount = Number(order.discount_amount) || 0;

    return (
        <HeaderLayout breadcrumbs={breadcrumbs}>
            <Head title={`Order #${order.transaction_number}`} />
            <div className="mx-auto max-w-6xl p-4 sm:p-6 lg:p-8">
                {/* Order Status Timeline */}
                <div className="flex flex-col justify-center gap-4 pb-10 sm:flex-row sm:flex-wrap sm:gap-8">
                    {[
                        { key: 'dibuat', label: 'Order Dibuat', icon: <Package size={16} /> },
                        { key: 'diproses', label: 'Pesanan Diproses', icon: <ShoppingBag size={16} /> },
                        { key: 'dalam-pengiriman', label: 'Dalam Pengiriman', icon: <Truck size={16} /> },
                        { key: 'diterima', label: 'Diterima', icon: <CheckCircle size={16} /> },
                    ].map((st, idx) => {
                        const done = idx <= activeIndex;
                        return (
                            <React.Fragment key={st.key}>
                                <div className="flex min-w-0 flex-1 flex-col items-center gap-2 sm:flex-row sm:items-start sm:gap-3">
                                    <div
                                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                                            done ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600'
                                        }`}
                                    >
                                        {st.icon}
                                    </div>
                                    <div className="overflow-hidden text-center text-sm sm:text-left">
                                        <div className={`${done ? 'font-semibold' : 'text-muted-foreground'} whitespace-nowrap`}>{st.label}</div>
                                        <div className="text-xs whitespace-nowrap">{formatTime(timeline[idx]?.time)}</div>
                                    </div>
                                </div>

                                {/* Connector */}
                                {idx < 3 && (
                                    <>
                                        <div className="flex w-full justify-center sm:hidden">
                                            <div className="h-4 border-r border-gray-300"></div>
                                        </div>
                                        <ArrowRight className="mx-1 hidden self-center text-gray-300 sm:block" />
                                    </>
                                )}
                            </React.Fragment>
                        );
                    })}
                </div>

                <div className="flex flex-col items-start justify-between gap-6 md:flex-row">
                    {/* LEFT SIDE */}
                    <div className="w-full flex-1 space-y-6 md:w-auto">
                        <Card className="p-4">
                            <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center sm:gap-6">
                                <div>
                                    <h3 className="text-xl font-semibold">Order #{order.transaction_number}</h3>
                                    <p className="text-sm text-muted-foreground">Placed: {formatTime(order.created_at)}</p>
                                </div>
                                <div className="mt-2 flex w-full flex-col gap-2 sm:mt-0 sm:w-auto sm:flex-row">
                                    <Button size="sm" className="w-full sm:w-auto">
                                        Send Invoice
                                    </Button>
                                    <Link href="/orders/history" className="w-full sm:w-auto">
                                        <Button size="sm" variant="outline" className="w-full sm:w-auto">
                                            <ArrowLeft className="mr-1 h-4 w-4" /> Back
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </Card>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Apotek Information</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {apotek ? (
                                        <div>
                                            <div className="font-medium">{apotek.name || '—'}</div>
                                            <div className="text-sm">{apotek.address || '—'}</div>
                                            <div className="text-sm">
                                                {apotek.branch} - {apotek.sap_id}
                                            </div>
                                            <div className="mt-2 text-sm">Phone: {apotek.phone || '-'}</div>
                                        </div>
                                    ) : (
                                        <div className="text-sm text-muted-foreground">No apotek information found</div>
                                    )}
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Payment Information</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-1">
                                        <div>
                                            <span className="font-medium">Method:</span> {order.payment_method}
                                        </div>
                                        <div>
                                            <span className="font-medium">Source of Fund:</span> {order.source_of_fund}
                                        </div>
                                        <div>
                                            <span className="font-medium">Payment Type:</span> {order.payment_type || '-'}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <Card>
                            <CardHeader>
                                <CardTitle>Items</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ScrollArea className="h-128 pr-4">
                                    <div className="space-y-4">
                                        {order.order_items?.map((item) => {
                                            const qty = Number(item.qty_delivered ?? item.quantity) || 0;
                                            const price = Number(item.unit_price) || 0;
                                            const content = Number(item.content) || 1;

                                            const lineTotal = price * qty * content;
                                            const unitTotal = price * content;

                                            return (
                                                <div key={item.id} className="flex items-center gap-4">
                                                    {item.product.image ? (
                                                        <img
                                                            src={item.product.image[0]}
                                                            alt={item.product.name}
                                                            className="h-14 w-14 shrink-0 rounded object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-gray-200">
                                                            <ShoppingBag className="h-6 w-6 text-gray-400" />
                                                        </div>
                                                    )}
                                                    <div className="min-w-0 flex-1">
                                                        <div className="truncate text-base font-medium">{item.product.name}</div>
                                                        <div className="text-sm">Qty: {qty}</div>
                                                    </div>
                                                    <div className="shrink-0 text-right">
                                                        <div className="font-semibold whitespace-nowrap">{currency(lineTotal)}</div>
                                                        <div className="text-sm whitespace-nowrap text-muted-foreground">
                                                            <PriceDisplay price={unitTotal} /> / {item.order_unit}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </ScrollArea>
                            </CardContent>
                        </Card>
                    </div>

                    {/* RIGHT SIDE */}
                    <aside className="mt-6 w-full space-y-4 md:mt-0 md:w-96">
                        <Card>
                            <CardHeader>
                                <CardTitle>Order Summary</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div>Product Price</div>
                                    <div className="text-right">{currency(order.subtotal_delivered ?? order.subtotal)}</div>

                                    <div>Product Tax (11%)</div>
                                    <div className="text-right">{currency(order.tax_delivered ?? order.tax_amount)}</div>

                                    <div>Shipping Cost</div>
                                    <div className="text-right">{currency(shipping)}</div>

                                    <div>Discount</div>
                                    <div className="text-right">-{currency(discount)}</div>

                                    <div className="text-base font-semibold">Total</div>
                                    <div className="text-right text-base font-semibold">{currency(order.total_delivered ?? order.total_price)}</div>
                                </div>
                            </CardContent>
                        </Card>

                        {order.status === 'dalam-pengiriman' && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">PAKET SUDAH TIBA</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <p className="text-sm text-muted-foreground">Harap konfirmasi bahwa paket sudah Anda terima</p>
                                    <div className="flex flex-col gap-2 sm:flex-row">
                                        <Button
                                            onClick={() => {
                                                router.post(
                                                    route('history.updateStatus', {
                                                        transaction_number: order.transaction_number,
                                                    }),
                                                    { status: 'diterima' },
                                                );
                                            }}
                                            className="w-full bg-green-600 text-white hover:bg-green-700 sm:flex-1"
                                        >
                                            Paket Sudah Diterima
                                        </Button>
                                        <Button variant="destructive" className="w-full text-white sm:flex-1">
                                            Laporkan
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </aside>
                </div>
            </div>
        </HeaderLayout>
    );
}
