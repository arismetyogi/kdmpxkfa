import AppLayout from "@/layouts/app-layout";
import { Head, Link } from "@inertiajs/react";
import { useState } from "react";
import { Search, Filter, Eye, Truck, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { router } from "@inertiajs/react";

const breadcrumbs = [
    { title: "Dashboard", href: "/dashboard" },
    { title: "Process Orders", href: "/purchase" },
];

const mockPOs = [
    { id: "PO 001", koperasi: "Koperasi Desa Purwokerto", date: "18-08-2025", qty: 12, price: 199800, status: "Process" },
    { id: "PO 002", koperasi: "Koperasi Desa Purworejo", date: "17-08-2025", qty: 19, price: 214900, status: "Process" },
    { id: "PO 003", koperasi: "Koperasi Desa Bangka", date: "16-08-2025", qty: 4, price: 68900, status: "Process" },
    { id: "PO 004", koperasi: "Koperasi Desa Aceh", date: "15-08-2025", qty: 35, price: 421600, status: "On Delivery" },
    { id: "PO 005", koperasi: "Koperasi Desa Solo", date: "14-08-2025", qty: 1, price: 9900, status: "On Delivery" },
    { id: "PO 006", koperasi: "Koperasi Desa Bangka", date: "13-08-2025", qty: 5, price: 72100, status: "Received" },
];

const statusStyle: Record<string, string> = {
    Process: "bg-yellow-100 text-yellow-700",
    "On Delivery": "bg-blue-100 text-blue-700",
    Received: "bg-green-100 text-green-700",
};

export default function ProcessOrders() {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");

    const filteredPOs = mockPOs.filter((po) => {
        const matchSearch = po.id.toLowerCase().includes(search.toLowerCase());
        const matchStatus = statusFilter === "ALL" || po.status === statusFilter;
        return matchSearch && matchStatus;
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Process Orders" />

            <div className="p-6 space-y-6">
                <h1 className="text-2xl font-bold">Process Orders</h1>
                <p className="text-gray-500">Manage Delivery from Purchase Orders</p>

                {/* Search & Filter */}
                <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                    <div className="relative w-full sm:w-1/2">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by PO ID..."
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <Filter className="w-5 h-5 text-gray-500" />
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-[160px]">
                                <SelectValue placeholder="All Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">All Status</SelectItem>
                                <SelectItem value="Process">Process</SelectItem>
                                <SelectItem value="On Delivery">On Delivery</SelectItem>
                                <SelectItem value="Received">Received</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Table */}
                <Card className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead className="bg-gray-100 text-gray-600 text-sm">
                        <tr>
                            <th className="p-3 text-left">PO ID</th>
                            <th className="p-3 text-left">Nama Koperasi</th>
                            <th className="p-3 text-left">Date</th>
                            <th className="p-3 text-left">Item QTY</th>
                            <th className="p-3 text-left">Total Price</th>
                            <th className="p-3 text-left">Status</th>
                            <th className="p-3 text-left">Actions</th>
                        </tr>
                        </thead>
                        <tbody className="text-sm divide-y">
                        {filteredPOs.map((po) => (
                            <tr key={po.id} className="hover:bg-gray-50">
                                <td className="p-3 font-medium">{po.id}</td>
                                <td className="p-3">{po.koperasi}</td>
                                <td className="p-3">{po.date}</td>
                                <td className="p-3">{po.qty}</td>
                                <td className="p-3">Rp{po.price.toLocaleString()}</td>
                                <td className="p-3">
                    <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyle[po.status] || "bg-gray-100 text-gray-700"}`}
                    >
                      {po.status}
                    </span>
                                </td>
                                <td className="p-3 flex gap-2">
                                    <Link href={route("process.delivery", po.id)}>
                                        <Button variant="ghost" size="icon">
                                            <Eye className="w-4 h-4 text-blue-600" />
                                        </Button>
                                    </Link>

                                    <Link href={route("process.order", po.id)}>
                                        <Button variant="ghost" size="icon">
                                            <Truck className="w-4 h-4 text-green-600" />
                                        </Button>
                                    </Link>

                                    <Button variant="ghost" size="icon">
                                        <X className="w-4 h-4 text-red-600" />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </Card>
            </div>
        </AppLayout>
    );
}
