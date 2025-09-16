import React from 'react';
import { Head, usePage, Link, router } from '@inertiajs/react';
import HeaderLayout from '@/layouts/header-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { ArrowRight, Package, Truck, CheckCircle, ArrowLeft } from 'lucide-react';
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
    Process: 0,
    'On Delivery': 1,
    Received: 2,
  };
  const activeIndex = stepIndexByStatus[order.status] ?? 0;

  return (
    <HeaderLayout breadcrumbs={breadcrumbs}>
      <Head title={`Order #${order.transaction_number}`} />

      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col md:flex-row items-start justify-between gap-6">
          {/* LEFT SIDE */}
          <div className="flex-1 space-y-6 w-full md:w-auto">
            {/* Header + Steps */}
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

              <div className="mt-4 grid grid-cols-2 sm:flex sm:flex-wrap gap-4 items-center justify-between">
                {[
                  { key: 'made', label: 'Order Made', icon: <Package size={16} /> },
                  { key: 'delivery', label: 'On Delivery', icon: <Truck size={16} /> },
                  { key: 'received', label: 'Received', icon: <CheckCircle size={16} /> },
                ].map((st, idx) => {
                  const done = idx <= activeIndex;
                  return (
                    <React.Fragment key={st.key}>
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            done
                              ? 'bg-green-600 text-white'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {st.icon}
                        </div>
                        <div className="text-sm">
                          <div
                            className={`${
                              done ? 'font-semibold' : 'text-muted-foreground'
                            }`}
                          >
                            {st.label}
                          </div>
                          <div className="text-xs">
                            {formatTime(timeline[idx]?.time)}
                          </div>
                        </div>
                      </div>
                      {idx < 2 && (
                        <ArrowRight className="hidden sm:block text-gray-300 mx-1" />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </Card>

            {/* Apotek Information + Payment Info */}
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
                    <div>
                      <span className="font-medium">Method:</span>{' '}
                      {order.payment_status}
                    </div>
                    <div>
                      <span className="font-medium">Total:</span>{' '}
                      {currency(order.total_price)}
                    </div>
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
                {order.order_items?.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    {item.product_image ? (
                      <img
                        src={item.product_image}
                        alt={item.product_name}
                        className="w-16 h-16 object-cover rounded"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-200 rounded" />
                    )}
                    <div className="flex-1">
                      <div className="font-medium">{item.product_name}</div>
                      <div className="text-sm">Qty: {item.quantity}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">
                        {currency(item.unit_price)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {currency(item.total_price)}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* RIGHT SIDE */}
          <aside className="w-full md:w-96 space-y-4 mt-6 md:mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  <div>Product Price</div>
                  <div className="text-right">{currency(order.subtotal)}</div>

                  <div>Product Tax</div>
                  <div className="text-right">{currency(order.tax_amount)}</div>

                  <div>Shipping Cost</div>
                  <div className="text-right">{currency(order.shipping_amount)}</div>

                  <div>Discount</div>
                  <div className="text-right">-{currency(order.discount_amount)}</div>

                  <div className="font-semibold">Total</div>
                  <div className="text-right font-semibold">
                    {currency(order.total_price)}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Confirmation */}
            {order.status === 'On Delivery' && (
              <Card>
                <CardHeader>
                  <CardTitle>PAKET SUDAH TIBA</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Harap konfirmasi bahwa paket sudah Anda terima
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2">
                  <Button
                    onClick={() => {
                        router.post(
                        route('history.updateStatus', {
                            transaction_number: order.transaction_number,
                        }),
                        { status: 'Received' }
                        );
                    }}
                    className="bg-green-600 text-white hover:bg-green-700 w-full sm:w-auto"
                    >
                    Paket Sudah Diterima
                    </Button>
                    <Button
                      variant="destructive"
                      className="w-full sm:flex-1 text-white"
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
