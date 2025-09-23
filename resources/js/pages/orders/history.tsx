import HeaderLayout from '@/layouts/header-layout';
import { Head, usePage, Link } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calender'; // Note: Corrected typo from 'calender' to 'calendar' if it exists in your project
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ShoppingBag, CreditCard, Calendar as CalendarIcon, Filter, Info } from 'lucide-react';
import { format } from 'date-fns';
import type { BreadcrumbItem, Order } from '@/types';

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
    const matchesDate = !selectedDate
      ? true
      : new Date(order.created_at).toDateString() === selectedDate.toDateString();
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

      <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-2xl font-semibold text-primary mb-6">Riwayat Transaksi</h1>

        {/* --- FILTER & SORT SECTION --- */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4 w-full lg:w-auto">
            {/* Filter by Status */}
            <div className="block lg:hidden w-full">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
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
          <div className="flex flex-col lg:flex-row gap-4 w-full lg:w-auto">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={'outline'}
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !selectedDate && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, 'd MMM yyyy') : <span>Pilih Tanggal</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  initialFocus
                  className="w-50"
                />
              </PopoverContent>
            </Popover>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full lg:w-56 h-full">
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT: List */}
          <div className="lg:col-span-1">
            <div className="space-y-3">
              {sortedAndFilteredOrders.length === 0 ? (
                <div className="text-center py-10 border-2 border-dashed rounded-lg">
                  <h3 className="text-lg font-medium text-secondary">Tidak Ada Transaksi</h3>
                  <p className="text-muted-foreground text-sm mt-1">
                    Coba ubah filter atau pencarian Anda.
                  </p>
                </div>
              ) : (
                sortedAndFilteredOrders.map((order) => (
                  <button
                    key={order.transaction_number}
                    onClick={() => setSelectedOrder(order)}
                    className={cn(
                      'w-full text-left p-4 border rounded-lg transition-all duration-200 hover:bg-muted/50 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
                      selectedOrder?.transaction_number === order.transaction_number &&
                        'bg-primary/10 border-primary shadow-sm'
                    )}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-sm text-card-foreground">
                          {order.transaction_number}
                        </p>
                        <p className="text-xs text-muted-foreground">{order.billing_name}</p>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs rounded-full font-medium whitespace-nowrap ${
                          statusColors[order.status] ?? 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {statusFilters[order.status] ?? order.status}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-3">
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
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                    <div className="flex items-center gap-3">
                      <div className="bg-muted p-2 rounded-full">
                        <ShoppingBag className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-semibold text-card-foreground">
                          {selectedOrder.transaction_number}
                        </p>
                        <p className="text-sm text-muted-foreground">{selectedOrder.billing_name}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-4 mt-2 sm:mt-0 w-full sm:w-auto">
                      <p className="text-xs text-muted-foreground text-right">
                        {format(new Date(selectedOrder.created_at), 'd MMM yyyy, HH:mm')}
                      </p>
                      <span
                        className={`px-2 py-1 text-xs rounded-full font-medium whitespace-nowrap ${
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
                      return (
                        <p className="text-sm text-muted-foreground">
                          Belum ada item untuk pesanan ini
                        </p>
                      );
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
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-14 h-14 rounded-lg object-cover"
                              />
                            ) : (
                              <div className="w-14 h-14 rounded-lg bg-muted flex items-center justify-center">
                                <ShoppingBag className="w-6 h-6 text-muted-foreground" />
                              </div>
                            )}
                            <div>
                              <p className="font-medium text-sm leading-tight text-card-foreground">
                                {item.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Qty: {item.pivot?.qty_delivered ?? item.pivot?.quantity}
                              </p>
                            </div>
                            <p className="text-sm font-medium text-card-foreground/90 ml-auto whitespace-nowrap">
                              {currency(
                                item.price * (item.pivot?.qty_delivered ?? item.pivot?.quantity ?? 1)
                              )}
                            </p>
                          </div>
                        ))}
                        {moreCount > 0 && (
                          <p className="text-xs text-muted-foreground pt-1">
                            +{moreCount} produk lainnya
                          </p>
                        )}
                      </>
                    );
                  })()}
                </CardContent>
                <CardFooter className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 px-4 rounded-b-lg">
                  <div className="flex items-center justify-between sm:justify-start sm:gap-4 w-full">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground pl-2">
                      <CreditCard className="w-5 h-5" />
                      <span>
                        {paymentLabels[selectedOrder.payment_method] ?? selectedOrder.payment_method}
                      </span>
                    </div>
                    <p className="font-semibold text-base text-card-foreground">
                      Rp {selectedOrder.total_price.toLocaleString()}
                    </p>
                  </div>
                  <Link
                    href={route('history.details', selectedOrder.transaction_number)}
                    className="w-full sm:w-auto"
                  >
                    <Button size="sm" className="w-full">
                      Lihat Detail Lengkap
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ) : (
              <div className="flex flex-col items-center justify-center h-full min-h-[400px] bg-muted/50 rounded-lg border-2 border-dashed">
                <Info className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium text-foreground">Pilih Transaksi</h3>
                <p className="text-muted-foreground text-sm mt-1">
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