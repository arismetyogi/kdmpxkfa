import { useState } from "react";
import { Search, Filter } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { type BreadcrumbItem, type Order } from "@/types";
import AppHeaderLayout from '@/layouts/app/app-header-layout';
import { Head, useForm } from "@inertiajs/react";
import { toast } from "sonner";

const breadcrumbs: BreadcrumbItem[] = [
  { title: "History Pemesanan", href: "orders/history" },
];

interface OrderHistoryProps {
  orders: Order[];
}

export default function OrderHistory({ orders }: OrderHistoryProps) {
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isAcceptDialogOpen, setIsAcceptDialogOpen] = useState(false);

  // 🔹 Filtering
  let filteredOrders = orders.filter((o) =>
    o.transaction_number.toLowerCase().includes(search.toLowerCase())
  );
  if (statusFilter !== "ALL") {
    filteredOrders = filteredOrders.filter((o) => o.status === statusFilter);
  }

  // 🔹 Form for accepting order
  const { data, post, processing, reset } = useForm({
      status: 'accepted',
  });

  // 🔹 Handle order acceptance
  const handleAcceptOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsAcceptDialogOpen(true);
  };

  const confirmAcceptOrder = () => {
    if (!selectedOrder) return;

    post(route('orders.accept', selectedOrder.id), {
      data,
      onSuccess: () => {
        toast.success("Order accepted successfully!");
        setIsAcceptDialogOpen(false);
        reset();
        // Reload the page to show updated data
        window.location.reload();
      },
      onError: (errors: any) => {
        toast.error(errors.status || "Failed to accept order. Please try again.");
      }
    });
  };

  // 🔹 Calculate total quantity for an order
  const calculateTotalQuantity = (order: Order) => {
    return order.order_items.reduce((total, item) => total + item.quantity, 0);
  };

  // 🔹 Format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  // 🔹 Get status style
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "new":
        return "bg-green-100 text-green-700";
      case "on-delivery":
        return "bg-blue-100 text-blue-700";
      case "received":
        return "bg-purple-100 text-purple-700";
      case "canceled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // 🔹 Format status label
  const formatStatusLabel = (status: string) => {
    const statusLabels: Record<string, string> = {
      new: "New Order",
      accepted: "Processed",
      delivering: "On Delivery",
      received: "Received",
      canceled: "Canceled"
    };

    return statusLabels[status] || status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <AppHeaderLayout breadcrumbs={breadcrumbs}>
      <Head title="Order History" />
      <div className="p-4 md:p-6 max-w-6xl mx-auto">
        <div className="grid gap-6">
          {/* Cooperative Info */}
          <Card className="rounded-2xl shadow-md">
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 md:p-6">
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">Cooperative Information</h2>
                <p className="text-sm text-gray-500">Your Cooperative Information</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 text-sm">
                <span className="font-semibold">ID Koperasi</span> <span>KOP 001</span>
                <span className="font-semibold">Nama Koperasi</span> <span>Koperasi Desa Purwokerto</span>
                <span className="font-semibold">Penanggungjawab</span> <span>Agus Setiawan</span>
                <span className="font-semibold">Outlet</span> <span>Kimia Farma Alun alun Purwokerto</span>
                <span className="font-semibold">Alamat</span> <span>Jl Tanggung raya No.12</span>
                <span className="font-semibold">Waktu Pendaftaran</span>{" "}
                <span>Selasa, 12 Agustus 2025, 18:00</span>
              </div>
            </CardContent>
          </Card>

          {/* Orders */}
          <Card className="rounded-2xl shadow-md">
            <CardContent className="p-4 md:p-6 space-y-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">History Orders</h2>
                  <p className="text-sm text-gray-500">
                    Jumlah transaksi yang telah Anda lakukan adalah{" "}
                    <b>{filteredOrders.length} Transaksi</b>
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-2 w-full md:w-auto">
                  {/* Search */}
                  <div className="relative w-full sm:w-auto">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search by Transaction ID..."
                      className="border rounded-lg pl-8 pr-3 py-2 text-sm w-full sm:w-64"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>

                  {/* Filter Status */}
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full sm:w-[160px]">
                      <Filter className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="accepted">Accepted</SelectItem>
                      <SelectItem value="delivering">On Deliver</SelectItem>
                      <SelectItem value="received">Received</SelectItem>
                      <SelectItem value="canceled">Canceled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm border-collapse">
                  <thead className="bg-gray-100 text-left">
                    <tr>
                      <th className="px-4 py-2">Transaction ID</th>
                      <th className="px-4 py-2">Nama Pembeli</th>
                      <th className="px-4 py-2">Date</th>
                      <th className="px-4 py-2">Item QTY</th>
                      <th className="px-4 py-2">Total Price</th>
                      <th className="px-4 py-2">Status</th>
                      <th className="px-4 py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((o) => (
                      <tr key={o.id} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-2">{o.transaction_number}</td>
                        <td className="px-4 py-2">{o.user?.name || 'N/A'}</td>
                        <td className="px-4 py-2">{formatDate(o.created_at)}</td>
                        <td className="px-4 py-2">{calculateTotalQuantity(o)}</td>
                        <td className="px-4 py-2">Rp {Number(o.total_price).toLocaleString("id-ID")}</td>
                        <td className="px-4 py-2">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(o.status)}`}
                          >
                            {formatStatusLabel(o.status)}
                          </span>
                        </td>
                        <td className="px-4 py-2">
                          {o.status === "pending" && (
                            <Button
                              size="sm"
                              onClick={() => handleAcceptOrder(o)}
                              disabled={processing}
                            >
                              Accept
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Accept Order Confirmation Dialog */}
      <Dialog open={isAcceptDialogOpen} onOpenChange={setIsAcceptDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Accept Order</DialogTitle>
            <DialogDescription>
              Are you sure you want to accept this order? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="py-4">
              <div className="space-y-2">
                <p><span className="font-semibold">Transaction ID:</span> {selectedOrder.transaction_number}</p>
                <p><span className="font-semibold">Customer:</span> {selectedOrder.user?.name || 'N/A'}</p>
                <p><span className="font-semibold">Total Items:</span> {calculateTotalQuantity(selectedOrder)}</p>
                <p><span className="font-semibold">Total Price:</span> Rp {Number(selectedOrder.total_price).toLocaleString("id-ID")}</p>
                <p><span className="font-semibold">Status:</span> <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusStyle(selectedOrder.status)}`}>{formatStatusLabel(selectedOrder.status)}</span></p>
              </div>
            </div>
          )}
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsAcceptDialogOpen(false)} disabled={processing}>
              Cancel
            </Button>
            <Button onClick={confirmAcceptOrder} disabled={processing}>
              {processing ? "Accepting..." : "Accept Order"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppHeaderLayout>
  );
}
