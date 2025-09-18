import AppLayout from "@/layouts/app-layout";
import { Head, Link, usePage } from "@inertiajs/react";
import { useState } from "react";
import { Search, Filter, Eye, Check, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import StatusBadge from "@/components/ui/status-badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export default function PurchaseOrders() {
  const { props }: any = usePage();
  const initialPOs = props.orders || [];

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [pos, setPos] = useState(initialPOs);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPO, setSelectedPO] = useState<string | null>(null);

  const filteredPOs = pos.filter((po: any) => {
    const matchSearch = po.id_transaksi
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchStatus = statusFilter === "ALL" || po.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleReject = (poId: string) => {
    setSelectedPO(poId);
    setModalOpen(true);
  };

  const confirmReject = () => {
    if (selectedPO) {
      setPos((prev: any[]) =>
        prev.map((po) =>
          po.id_transaksi === selectedPO ? { ...po, status: "Rejected" } : po
        )
      );
      setSelectedPO(null);
      setModalOpen(false);
    }
  };

  return (
    <AppLayout
      breadcrumbs={[
        { title: "Dashboard", href: "/dashboard" },
        { title: "Purchase Orders", href: "/purchase" },
      ]}
    >
      <Head title="Purchase Orders" />

      <div className="p-6 space-y-6 dark:bg-gray-950 dark:text-gray-100">
        <h1 className="text-2xl font-bold">Purchase Orders</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Manage incoming purchase orders from cooperatives
        </p>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-1/2">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Search by PO ID..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[160px] dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100">
                <SelectItem value="ALL">All Status</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Accepted">Accepted</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table */}
        <Card className="overflow-x-auto dark:bg-gray-900 dark:border-gray-700">
          <table className="w-full border-collapse">
            <thead className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-sm">
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
            <tbody className="text-sm divide-y dark:divide-gray-700">
              {filteredPOs.map((po: any) => (
                <tr
                  key={po.id_transaksi}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <td className="p-3 font-medium">{po.id_transaksi}</td>
                  <td className="p-3">{po.merchant_name}</td>
                  <td className="p-3">
                    {new Date(po.created_at).toLocaleDateString("id-ID")}
                  </td>
                  <td className="p-3">{po.total_qty}</td>
                  <td className="p-3">
                    Rp{Number(po.total_nominal).toLocaleString("id-ID")}
                  </td>
                  <td className="p-3">
                    <StatusBadge status={po.status} />
                  </td>

                  <td className="p-3 flex gap-2">
                    {/* Tombol Preview selalu ada */}
                    <Link href={route("purchase.show", po.id_transaksi)}>
                      <Button variant="ghost" size="icon">
                        <Eye className="w-4 h-4 text-blue-600" />
                      </Button>
                    </Link>

                    {po.status === "Pending" && (
                      <>
                        <Button variant="ghost" size="icon">
                          <Check className="w-4 h-4 text-green-600" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleReject(po.id_transaksi)}
                        >
                          <X className="w-4 h-4 text-red-600" />
                        </Button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>

      {/* Reject Confirmation Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle>Reject Purchase Order</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to reject PO {selectedPO}?</p>
          <DialogFooter className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setModalOpen(false)}
              className="dark:border-gray-700 dark:text-gray-200"
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmReject}>
              Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
