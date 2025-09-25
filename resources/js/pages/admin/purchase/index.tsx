import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import StatusBadge from '@/components/ui/status-badge';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Check, Eye, Filter, Search, X } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function PurchaseOrders({ orders }: { orders?: any[] }) {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedPO, setSelectedPO] = useState<string | null>(null);

    const filteredOrders = orders?.filter((po) => {
        const matchSearch = po.id_transaksi.toLowerCase().includes(search.toLowerCase());
        const matchStatus = statusFilter === 'ALL' || po.status === statusFilter;
        return matchSearch && matchStatus;
    });

    const handleReject = (poId: string) => {
        setSelectedPO(poId);
        setModalOpen(true);
    };

    const confirmReject = () => {
        if (selectedPO) {
            router.post(
                route('admin.purchase.reject', selectedPO),
                {},
                {
                    onSuccess: () => {
                        setModalOpen(false);
                        toast.success(`Purchase Order ${selectedPO} berhasil ditolak.`);
                    },
                    onError: (errors) => {
                        setModalOpen(false);
                        toast.error('Gagal menolak PO. Silakan coba lagi.');
                        console.error(errors);
                    },
                },
            );
        }
    };

    const handleAccept = (poId: string) => {
        router.post(
            route('admin.purchase.accept', poId),
            {},
            {
                onSuccess: () => {
                    toast.success(`Purchase Order ${poId} berhasil disetujui.`);
                },
                onError: (errors) => {
                    toast.error('Gagal menyetujui PO. Silakan coba lagi.');
                    console.error(errors);
                },
            },
        );
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Dashboard', href: route('admin.dashboard') },
                { title: 'Purchase Orders', href: route('admin.purchase.index') },
            ]}
        >
            <Head title="Purchase Orders" />

            <div className="space-y-6 p-6 dark:bg-gray-950 dark:text-gray-100">
                <h1 className="text-2xl font-bold">Purchase Orders</h1>
                <p className="text-gray-500 dark:text-gray-400">Manage incoming purchase orders from cooperatives</p>

                {/* Search & Filter */}
                <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
                    <div className="relative w-full sm:w-1/2">
                        <Search className="absolute top-3 left-3 h-4 w-4 text-gray-400 dark:text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search by PO ID..."
                            className="w-full rounded-lg border py-2 pr-4 pl-10 focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <Filter className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-[160px] dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100">
                                <SelectValue placeholder="All Status" />
                            </SelectTrigger>
                            <SelectContent className="dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100">
                                <SelectItem value="ALL">All Status</SelectItem>
                                <SelectItem value="Pending">Pending</SelectItem>
                                <SelectItem value="Accepted">Accepted</SelectItem>
                                <SelectItem value="Rejected">Rejected</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Table */}
                <Card className="overflow-x-auto dark:border-gray-700 dark:bg-gray-900">
                    <table className="w-full border-collapse">
                        <thead className="bg-gray-100 text-sm text-gray-600 dark:bg-gray-800 dark:text-gray-400">
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
                        <tbody className="divide-y text-sm dark:divide-gray-700">
                            {/* Gunakan filteredOrders di sini */}
                            {filteredOrders?.map((po) => (
                                <tr key={po.id_transaksi} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                    <td className="p-3 font-medium">{po.id_transaksi}</td>
                                    <td className="p-3">{po.merchant_name}</td>
                                    <td className="p-3">{new Date(po.created_at).toLocaleDateString('id-ID')}</td>
                                    <td className="p-3">{po.total_qty}</td>
                                    <td className="p-3">Rp{Number(po.total_nominal).toLocaleString('id-ID')}</td>
                                    <td className="p-3">
                                        <StatusBadge status={po.status} />
                                    </td>
                                    <td className="flex gap-2 p-3">
                                        <Link href={route('admin.purchase.show', po.id_transaksi)}>
                                            <Button variant="ghost" size="icon">
                                                <Eye className="h-4 w-4 text-blue-600" />
                                            </Button>
                                        </Link>

                                        {po.status === 'Pending' && (
                                            <>
                                                <Button variant="ghost" size="icon" onClick={() => handleAccept(po.id_transaksi)}>
                                                    <Check className="h-4 w-4 text-green-600" />
                                                </Button>

                                                <Button variant="ghost" size="icon" onClick={() => handleReject(po.id_transaksi)}>
                                                    <X className="h-4 w-4 text-red-600" />
                                                </Button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {filteredOrders?.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="p-3 text-center text-muted-foreground">
                                        Tidak ada pesanan ditemukan.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </Card>
            </div>

            {/* Reject Confirmation Modal */}
            <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                <DialogContent className="dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100">
                    <DialogHeader>
                        <DialogTitle>Reject Purchase Order</DialogTitle>
                    </DialogHeader>
                    <p>Are you sure you want to reject PO {selectedPO}?</p>
                    <DialogFooter className="mt-4 flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setModalOpen(false)} className="dark:border-gray-700 dark:text-gray-200">
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
