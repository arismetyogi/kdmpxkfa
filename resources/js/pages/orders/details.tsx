import React from 'react';
import { Head, usePage, Link, router } from '@inertiajs/react';
import HeaderLayout from '@/layouts/header-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { ArrowRight, Package, Truck, CheckCircle, ArrowLeft, ShoppingBag } from 'lucide-react';
import type { BreadcrumbItem, Order, Apotek } from '@/types';


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

  const currency = (v: number) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(v ?? 0);

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

  console.log(order);

  return (
    <HeaderLayout breadcrumbs={breadcrumbs}>
      <Head title={`Order #${order.transaction_number}`} />
      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* --- MOVED TIMELINE TO THE TOP --- */}
            {/* Order Status Timeline - Centered */}
            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4 sm:gap-8 justify-center pb-10">
              {[
                // Added 'Pesanan Diproses' step
                { key: 'dibuat', label: 'Order Dibuat', icon: <Package size={16} /> },
                { key: 'diproses', label: 'Pesanan Diproses', icon: <ShoppingBag size={16} /> },
                { key: 'dalam-pengiriman', label: 'Dalam Pengiriman', icon: <Truck size={16} /> },
                { key: 'diterima', label: 'Diterima', icon: <CheckCircle size={16} /> },
              ].map((st, idx) => {
                const done = idx <= activeIndex;
                return (
                  <React.Fragment key={st.key}>
                    <div className="flex flex-1 flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-3 min-w-0">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0
                          ${done ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600'}
                        `}
                      >
                        {st.icon}
                      </div>
                      <div className="text-center sm:text-left text-sm overflow-hidden text-ellipsis">
                        <div
                          className={`${done ? 'font-semibold' : 'text-muted-foreground'} whitespace-nowrap`}
                        >
                          {st.label}
                        </div>
                        <div className="text-xs whitespace-nowrap">
                          {formatTime(timeline[idx]?.time)}
                        </div>
                      </div>
                    </div>

                    {/* Connector → Arrow on desktop, vertical line on mobile */}
                    {idx < 3 && (
                      <>
                        {/* Mobile: vertical line/spacer */}
                        <div className="sm:hidden w-full flex justify-center">
                          <div className="h-4 border-r border-gray-300"></div>
                        </div>
                        {/* Desktop: arrow */}
                        <ArrowRight className="hidden sm:block text-gray-300 mx-1 self-center" />
                      </>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
        
        <div className="flex flex-col md:flex-row items-start justify-between gap-6">
          {/* LEFT SIDE - Takes full width on mobile, expands on medium screens */}
          <div className="flex-1 space-y-6 w-full md:w-auto">
            {/* Header */}
            <Card className="p-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-6">
                <div>
                  <h3 className="text-xl font-semibold">
                    Order #{order.transaction_number}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Placed: {formatTime(order.created_at)}
                  </p>
                </div>
                {/* Buttons stack on mobile, go side-by-side on sm screens */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mt-2 sm:mt-0 w-full sm:w-auto">
                  <Button size="sm" className="w-full sm:w-auto">
                    Send Invoice
                  </Button>
                  <Link href="/orders/history" className="w-full sm:w-auto">
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full sm:w-auto"
                    >
                      <ArrowLeft className="w-4 h-4 mr-1" /> Back
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>

            {/* Apotek Information + Payment Info - Grid stacks on mobile */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      <div className="text-sm mt-2">
                        Phone: {apotek.phone || '-'}
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground">
                      No apotek information found
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Payment Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                      <div><span className="font-medium">Method:</span> {order.payment_method}</div>
                      <div><span className="font-medium">Source of Fund:</span> {order.source_of_fund}</div>
                      <div><span className="font-medium">Payment Type:</span> {order.payment_type || '-'}</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Items */}
            <Card>
              <CardHeader>
                <CardTitle>Items</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {order.products?.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-14 h-14 object-cover rounded shrink-0"
                      />
                    ) : (
                    <div className="w-14 h-14 rounded-lg bg-gray-200 flex items-center justify-center">
                      <ShoppingBag className="w-6 h-6 text-gray-400" />
                    </div>
                    )}
                    <div className="flex-1 min-w-0"> {/* Added min-w-0 to prevent overflow */}
                      <div className="font-medium text-base truncate">{item.name}</div> {/* Added truncate */}
                      <div className="text-sm">Qty: {item.pivot?.qty_delivered ?? item.pivot?.quantity}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-semibold whitespace-nowrap">
                        {currency(item.price)}
                      </div>
                      <div className="text-sm text-muted-foreground whitespace-nowrap">
                        {currency(item.price * (item.pivot?.qty_delivered ?? item.pivot?.quantity ?? 1))}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* RIGHT SIDE - Order Summary & Confirmation */}
          <aside className="w-full md:w-96 space-y-4 mt-6 md:mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
<CardContent>
  {(() => {
    // ✅ Subtotal (sum of price × quantity)
    const subtotal = order.products?.reduce((sum, item) => {
      const qty = item.pivot?.qty_delivered ?? item.pivot?.quantity ?? 1;
      return sum + (item.price * qty);
    }, 0) ?? 0;

    // ✅ Tax (11%)
    const tax = subtotal * 0.11;

    // ✅ Shipping cost (fallback 0 if not available)
    const shipping = order.shipping_amount ?? 0;

    // ✅ Discount (fallback 0 if not available)
    const discount = order.discount_amount ?? 0;

    // ✅ Final total
    const total = subtotal + tax ;

    return (
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>Product Price</div>
        <div className="text-right">{currency(subtotal)}</div>

        <div>Product Tax (11%)</div>
        <div className="text-right">{currency(tax)}</div>

        <div>Shipping Cost</div>
        <div className="text-right">{currency(shipping)}</div>

        <div>Discount</div>
        <div className="text-right">-{currency(discount)}</div>

        <div className="font-semibold text-base">Total</div>
        <div className="text-right font-semibold text-base">
          {currency(total)}
        </div>
      </div>
    );
  })()}
</CardContent>
            </Card>

            {/* Confirmation */}
            {order.status === 'dalam-pengiriman' && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">PAKET SUDAH TIBA</CardTitle> {/* Adjusted title size */}
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Harap konfirmasi bahwa paket sudah Anda terima
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2"> {/* Buttons stack on mobile */}
                  <Button
                    onClick={() => {
                        router.post(
                        route('history.updateStatus', {
                            transaction_number: order.transaction_number,
                        }),
                        { status: 'diterima' }
                        );
                    }}
                    className="bg-green-600 text-white hover:bg-green-700 w-full sm:flex-1" // w-full for mobile
                    >
                    Paket Sudah Diterima
                    </Button>
                    <Button
                      variant="destructive"
                      className="w-full sm:flex-1 text-white" // w-full for mobile
                    >
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
