import { useState } from "react";
import { Search, Filter } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AppLayout from "@/layouts/app-layout";
import { type BreadcrumbItem } from "@/types";

const breadcrumbs: BreadcrumbItem[] = [
  { title: "History Pemesanan", href: "orders/history" },
];

export default function OrderHistory() {
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  const orders = [
    { id: "TO 001", buyer: "Agus Praya", date: "18-07-2025", qty: 80, price: 2000000, status: "Accepted" },
    { id: "TO 002", buyer: "Asep Bhag", date: "18-06-2025", qty: 56, price: 918000, status: "On Deliver" },
    { id: "TO 003", buyer: "Siti Amalia", date: "18-08-2025", qty: 12, price: 199800, status: "Pending" },
    { id: "TO 004", buyer: "Kirana uy", date: "18-09-2025", qty: 21, price: 555000, status: "Pending" },
  ];

  // 🔹 Filtering
  let filteredOrders = orders.filter((o) =>
    o.id.toLowerCase().includes(search.toLowerCase())
  );
  if (statusFilter !== "ALL") {
    filteredOrders = filteredOrders.filter((o) => o.status === statusFilter);
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
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
                    <b>{orders.length} Transaksi</b>
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
                      <SelectItem value="Accepted">Accepted</SelectItem>
                      <SelectItem value="On Deliver">On Deliver</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
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
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((o, idx) => (
                      <tr key={idx} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-2">{o.id}</td>
                        <td className="px-4 py-2">{o.buyer}</td>
                        <td className="px-4 py-2">{o.date}</td>
                        <td className="px-4 py-2">{o.qty}</td>
                        <td className="px-4 py-2">Rp {o.price.toLocaleString("id-ID")},00</td>
                        <td className="px-4 py-2">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              o.status === "Accepted"
                                ? "bg-green-100 text-green-700"
                                : o.status === "On Deliver"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {o.status}
                          </span>
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
    </AppLayout>
  );
}
