import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calender'; // Note: Corrected typo from 'calender' to 'calendar' if it exists in your project
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import HeaderLayout from '@/layouts/header-layout';
import { cn } from '@/lib/utils';
import type { BreadcrumbItem, Order } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, CreditCard, Filter, Info, ShoppingBag } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Order History', href: '/pemesanan/history' },
];

export default function History() {
    const { orders, statusColors, statusFilters } = usePage<{
        orders: Order[];
        statusColors: Record<string, string>;
        statusFilters: Record<string, string>;
    }>().props;

    const [filterStatus, setFilterStatus] = useState('Semua');
    const [sortBy, setSortBy] = useState('newest');
    const [selectedDate, setSelectedDate] = useState<Date | undefined>();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    // --- FILTERING & SORTING ---
    const filteredOrders = orders.filter((order) => {
        const matchesStatus = filterStatus === 'Semua' ? true : order.status === filterStatus;
        const matchesDate = !selectedDate ? true : new Date(order.created_at).toDateString() === selectedDate.toDateString();
        const matchesSearch =
            searchQuery.trim() === ''
                ? true
                : order.transaction_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  order.billing_name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesDate && matchesSearch;
    });

    const sortedAndFilteredOrders = [...filteredOrders].sort((a, b) => {
        switch (sortBy) {
            case 'oldest':
                return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
            case 'highest_total':
                return b.total_price - a.total_price;
            case 'lowest_total':
                return a.total_price - b.total_price;
            case 'newest':
            default:
                return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        }
    });

    const currency = (v: number) =>
        new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        }).format(v ?? 0);

    const paymentLabels: Record<string, string> = {
        cad: 'Cash After Delivery',
        va: 'Virtual Account',
    };
    console.log(selectedOrder);

    // --- RENDER ---
    return (
        <HeaderLayout breadcrumbs={breadcrumbs}>
            <Head title="Riwayat Transaksi" />

            <div className="min-h-screen px-4 py-10 sm:px-6 lg:px-8">
                <h1 className="mb-6 text-2xl font-semibold text-primary">Riwayat Transaksi</h1>

                {/* --- FILTER & SORT SECTION --- */}
                <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex w-full flex-col gap-4 lg:w-auto lg:flex-row lg:items-center">
                        {/* Filter by Status */}
                        <div className="block w-full lg:hidden">
                            <Select value={filterStatus} onValueChange={setFilterStatus}>
                                <SelectTrigger>
                                    <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
                                    <SelectValue placeholder="Filter status..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Semua">Semua</SelectItem>
                                    {Object.entries(statusFilters).map(([key, value]) => (
                                        <SelectItem key={key} value={key}>
                                            {value}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="hidden lg:block">
                            <Tabs value={filterStatus} onValueChange={setFilterStatus}>
                                <TabsList>
                                    <TabsTrigger value="Semua">Semua</TabsTrigger>
                                    {Object.entries(statusFilters).map(([key, value]) => (
                                        <TabsTrigger key={key} value={key}>
                                            {value}
                                        </TabsTrigger>
                                    ))}
                                </TabsList>
                            </Tabs>
                        </div>
                        {/* Search */}
                        <Input
                            type="text"
                            placeholder="Cari No Transaksi / Nama Billing..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full lg:w-64"
                        />
                    </div>

                    {/* Date & Sorting */}
                    <div className="flex w-full flex-col gap-4 lg:w-auto lg:flex-row">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={'outline'}
                                    className={cn('w-full justify-start text-left font-normal', !selectedDate && 'text-muted-foreground')}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {selectedDate ? format(selectedDate, 'd MMM yyyy') : <span>Pilih Tanggal</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} initialFocus className="w-50" />
                            </PopoverContent>
                        </Popover>
                        <Select value={sortBy} onValueChange={setSortBy}>
                            <SelectTrigger className="h-full w-full lg:w-56">
                                <SelectValue placeholder="Urutkan" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="newest">Terbaru</SelectItem>
                                <SelectItem value="oldest">Terlama</SelectItem>
                                <SelectItem value="highest_total">Total Tertinggi</SelectItem>
                                <SelectItem value="lowest_total">Total Terendah</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* --- MASTER-DETAIL LAYOUT --- */}
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {/* LEFT: List */}
                    <div className="lg:col-span-1">
                        <div className="space-y-3">
                            {sortedAndFilteredOrders.length === 0 ? (
                                <div className="rounded-lg border-2 border-dashed py-10 text-center">
                                    <h3 className="text-lg font-medium text-secondary">Tidak Ada Transaksi</h3>
                                    <p className="mt-1 text-sm text-muted-foreground">Coba ubah filter atau pencarian Anda.</p>
                                </div>
                            ) : (
                                sortedAndFilteredOrders.map((order) => (
                                    <button
                                        key={order.transaction_number}
                                        onClick={() => setSelectedOrder(order)}
                                        className={cn(
                                            'w-full rounded-lg border p-4 text-left transition-all duration-200 hover:bg-muted/50 hover:shadow-sm focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:outline-none',
                                            selectedOrder?.transaction_number === order.transaction_number &&
                                                'border-primary bg-primary/10 shadow-sm',
                                        )}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <p className="text-sm font-semibold text-card-foreground">{order.transaction_number}</p>
                                                <p className="text-xs text-muted-foreground">{order.billing_name}</p>
                                            </div>
                                            <span
                                                className={`rounded-full px-2 py-1 text-xs font-medium whitespace-nowrap ${
                                                    statusColors[order.status] ?? 'bg-muted text-muted-foreground'
                                                }`}
                                            >
                                                {statusFilters[order.status] ?? order.status}
                                            </span>
                                        </div>
                                        <p className="mt-3 text-xs text-muted-foreground">
                                            {format(new Date(order.created_at), 'd MMM yyyy, HH:mm')}
                                        </p>
                                    </button>
                                ))
                            )}
                        </div>
                    </div>

                    {/* RIGHT: Detail */}
                    <div className="lg:col-span-2">
                        {selectedOrder ? (
                            <Card className="sticky top-24">
                                <CardHeader>
                                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="rounded-full bg-muted p-2">
                                                <ShoppingBag className="h-5 w-5 text-muted-foreground" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-card-foreground">{selectedOrder.transaction_number}</p>
                                                <p className="text-sm text-muted-foreground">{selectedOrder.billing_name}</p>
                                            </div>
                                        </div>
                                        <div className="mt-2 flex w-full items-center justify-between gap-4 sm:mt-0 sm:w-auto sm:justify-end">
                                            <p className="text-right text-xs text-muted-foreground">
                                                {format(new Date(selectedOrder.created_at), 'd MMM yyyy, HH:mm')}
                                            </p>
                                            <span
                                                className={`rounded-full px-2 py-1 text-xs font-medium whitespace-nowrap ${
                                                    statusColors[selectedOrder.status] ?? 'bg-muted text-muted-foreground'
                                                }`}
                                            >
                                                {statusFilters[selectedOrder.status] ?? selectedOrder.status}
                                            </span>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {(() => {
                                        const items = selectedOrder.products ?? [];
                                        if (items.length === 0) {
                                            return <p className="text-sm text-muted-foreground">Belum ada item untuk pesanan ini</p>;
                                        }

                                        // ✅ Recalculate total from items
                                        const calculatedTotal = items.reduce((sum, item) => {
                                            const qty = item.pivot?.qty_delivered ?? item.pivot?.quantity ?? 1;
                                            return sum + item.price * qty;
                                        }, 0);

                                        // we’ll use this later in CardFooter instead of selectedOrder.total_price
                                        selectedOrder.total_price = calculatedTotal + calculatedTotal * 0.11;

                                        const showItems = items.slice(0, 3);
                                        const moreCount = items.length > 3 ? items.length - 3 : 0;

                                        return (
                                            <>
                                                {showItems.map((item) => (
                                                    <div key={item.id} className="flex items-center gap-4">
                                                        {item.image ? (
                                                            <img src={item.image} alt={item.name} className="h-14 w-14 rounded-lg object-cover" />
                                                        ) : (
                                                            <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-muted">
                                                                <ShoppingBag className="h-6 w-6 text-muted-foreground" />
                                                            </div>
                                                        )}
                                                        <div>
                                                            <p className="text-sm leading-tight font-medium text-card-foreground">{item.name}</p>
                                                            <p className="text-xs text-muted-foreground">
                                                                Qty: {item.pivot?.qty_delivered ?? item.pivot?.quantity}
                                                            </p>
                                                        </div>
                                                        <p className="ml-auto text-sm font-medium whitespace-nowrap text-card-foreground/90">
                                                            {currency(item.price * (item.pivot?.qty_delivered ?? item.pivot?.quantity ?? 1))}
                                                        </p>
                                                    </div>
                                                ))}
                                                {moreCount > 0 && <p className="pt-1 text-xs text-muted-foreground">+{moreCount} produk lainnya</p>}
                                            </>
                                        );
                                    })()}
                                </CardContent>
                                <CardFooter className="flex flex-col items-stretch justify-between gap-3 rounded-b-lg px-4 sm:flex-row sm:items-center">
                                    <div className="flex w-full items-center justify-between sm:justify-start sm:gap-4">
                                        <div className="flex items-center gap-2 pl-2 text-sm text-muted-foreground">
                                            <CreditCard className="h-5 w-5" />
                                            <span>{paymentLabels[selectedOrder.payment_method] ?? selectedOrder.payment_method}</span>
                                        </div>
                                        <p className="text-base font-semibold text-card-foreground">
                                            Rp {selectedOrder.total_price.toLocaleString()}
                                        </p>
                                    </div>
                                    <Link href={route('history.details', selectedOrder.transaction_number)} className="w-full sm:w-auto">
                                        <Button size="sm" className="w-full">
                                            Lihat Detail Lengkap
                                        </Button>
                                    </Link>
                                </CardFooter>
                            </Card>
                        ) : (
                            <div className="flex h-full min-h-[400px] flex-col items-center justify-center rounded-lg border-2 border-dashed bg-muted/50">
                                <Info className="mb-4 h-12 w-12 text-muted-foreground" />
                                <h3 className="text-lg font-medium text-foreground">Pilih Transaksi</h3>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Pilih sebuah transaksi dari daftar di sebelah kiri untuk melihat detailnya.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </HeaderLayout>
    );
}