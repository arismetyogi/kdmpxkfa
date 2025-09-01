import AppLayout from "@/layouts/app-layout";
import { Head, usePage } from "@inertiajs/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Pencil, Trash2, CheckCircle2 } from "lucide-react";
import { Link } from "@inertiajs/react";


const initialItems = [
    {
        name: "Paracetamol",
        exp: "18-07-2026",
        qty: 2,
        unitPrice: 15000,
        discount: 0,
        tax: 11,
        total: 16600,
    },
    {
        name: "Amoxilin",
        exp: "18-07-2026",
        qty: 9,
        unitPrice: 15000,
        discount: 0,
        tax: 11,
        total: 16600,
    },
];

export default function ViewOrder() {
    const { props }: any = usePage();
    const { id } = props;

    const [items, setItems] = useState(initialItems);
    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [editData, setEditData] = useState<any>(null);

    // ✅ success popup state
    const [openSuccess, setOpenSuccess] = useState(false);

    // Open edit modal
    const handleEdit = (idx: number) => {
        setEditIndex(idx);
        setEditData(items[idx]);
    };

    // Save edit
    const handleSaveEdit = () => {
        if (editIndex !== null) {
            const newItems = [...items];
            newItems[editIndex] = editData;
            setItems(newItems);
            setEditIndex(null);
            setEditData(null);
        }
    };

    // Delete item
    const handleDelete = (idx: number) => {
        setItems(items.filter((_, i) => i !== idx));
    };

    // ✅ handle save DO
    const handleSaveDO = () => {
        // Nanti bisa ganti dengan post ke backend
        setOpenSuccess(true);
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: "Dashboard", href: "/dashboard" },
                { title: "Process Orders", href: "/process" },
                { title: "Delivery Orders", href: "/process/delivery" },
            ]}
        >
            <Head title={`Delivery Order ${id}`} />

            <div className="p-6 space-y-6">
                <h1 className="text-2xl font-bold">Delivery Order {id}</h1>
                <p className="text-gray-500">Create Delivery Order for Purchase Orders</p>

                {/* Purchase Order Info */}
                <Card className="p-4 space-y-4">
                    <h2 className="font-semibold">Purchase Order Informations</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <input className="border rounded p-2" value="Koperasi Desa Pejagalan" readOnly />
                        <input className="border rounded p-2" value="Kusnadie" readOnly />
                        <input className="border rounded p-2" value="Agus Praya" readOnly />
                        <input className="border rounded p-2" value="30" readOnly />
                    </div>
                </Card>

                {/* Delivery Location */}
                <Card className="p-4 space-y-4">
                    <h2 className="font-semibold">Delivery Location</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <input className="border rounded p-2" value="Jl. Jenderal Sudirman No. 21 KAV 3" readOnly />
                        <input className="border rounded p-2" value="Jati" readOnly />
                        <input className="border rounded p-2" value="Banyuwangi" readOnly />
                        <input className="border rounded p-2" value="Jawa Tengah" readOnly />
                        <input className="border rounded p-2" value="RT 11 / RW 12" readOnly />
                        <input className="border rounded p-2" value="142510" readOnly />
                    </div>
                </Card>

                {/* Barang Pesanan */}
                <Card className="p-4 space-y-4">
                    <h2 className="font-semibold">Barang Pesanan</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-sm">
                            <thead className="bg-gray-100 text-gray-600">
                            <tr>
                                <th className="p-2 text-left">Nama Barang</th>
                                <th className="p-2">EXP Date</th>
                                <th className="p-2">Item QTY</th>
                                <th className="p-2">Price Unit</th>
                                <th className="p-2">Discount</th>
                                <th className="p-2">Tax</th>
                                <th className="p-2">Total Price</th>
                                <th className="p-2">Action</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y">
                            {items.map((item, idx) => (
                                <tr key={idx}>
                                    <td className="p-2">{item.name}</td>
                                    <td className="p-2">{item.exp}</td>
                                    <td className="p-2">{item.qty}</td>
                                    <td className="p-2">Rp{item.unitPrice.toLocaleString()},00</td>
                                    <td className="p-2">{item.discount}%</td>
                                    <td className="p-2">{item.tax}%</td>
                                    <td className="p-2">Rp{item.total.toLocaleString()},00</td>
                                    <td className="p-2 flex gap-2">
                                        <Button variant="ghost" size="icon" onClick={() => handleEdit(idx)}>
                                            <Pencil className="w-4 h-4 text-blue-600" />
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => handleDelete(idx)}>
                                            <Trash2 className="w-4 h-4 text-red-600" />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </Card>

                {/* Edit Modal */}
                <Dialog open={editIndex !== null} onOpenChange={() => { setEditIndex(null); setEditData(null); }}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Edit Barang</DialogTitle>
                        </DialogHeader>
                        {editData && (
                            <form className="space-y-3" onSubmit={e => { e.preventDefault(); handleSaveEdit(); }}>
                                <div>
                                    <label className="block text-sm mb-1">Nama Barang</label>
                                    <input className="border rounded p-2 w-full bg-gray-100" value={editData.name} disabled />
                                </div>
                                <div>
                                    <label className="block text-sm mb-1">EXP Date</label>
                                    <input className="border rounded p-2 w-full bg-gray-100" value={editData.exp} disabled />
                                </div>
                                <div>
                                    <label className="block text-sm mb-1">Item QTY</label>
                                    <input
                                        type="number"
                                        className="border rounded p-2 w-full"
                                        value={editData.qty}
                                        onChange={e => setEditData({ ...editData, qty: Number(e.target.value) })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm mb-1">Price Unit</label>
                                    <input type="number" className="border rounded p-2 w-full bg-gray-100" value={editData.unitPrice} disabled />
                                </div>
                                <div>
                                    <label className="block text-sm mb-1">Discount (%)</label>
                                    <input type="number" className="border rounded p-2 w-full bg-gray-100" value={editData.discount} disabled />
                                </div>
                                <div>
                                    <label className="block text-sm mb-1">Tax (%)</label>
                                    <input type="number" className="border rounded p-2 w-full bg-gray-100" value={editData.tax} disabled />
                                </div>
                                <div>
                                    <label className="block text-sm mb-1">Total Price</label>
                                    <input type="number" className="border rounded p-2 w-full bg-gray-100" value={editData.total} disabled />
                                </div>
                                <div className="flex justify-end gap-2 pt-2">
                                    <Button variant="outline" type="button" onClick={() => { setEditIndex(null); setEditData(null); }}>Batal</Button>
                                    <Button className="bg-blue-600 text-white" type="submit">Simpan</Button>
                                </div>
                            </form>
                        )}
                    </DialogContent>
                </Dialog>

                {/* ✅ Success Popup */}
                <Dialog open={openSuccess} onOpenChange={setOpenSuccess}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 text-green-600">
                                <CheckCircle2 className="w-6 h-6" />
                                Berhasil Disimpan
                            </DialogTitle>
                        </DialogHeader>
                        <p className="text-gray-600">Delivery Order berhasil disimpan ke sistem.</p>
                        <DialogFooter>
                            <Link href={route("process.order", id)}>
                                <Button onClick={() => setOpenSuccess(false)} className="bg-green-600 text-white">
                                    OK
                                </Button>
                            </Link>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Buttons */}
                <div className="flex justify-end gap-3">

                    <Button variant="outline">Batal</Button>

                    {/* Simpan DO pakai handler */}
                    <Button className="bg-green-600 text-white" onClick={handleSaveDO}>
                        Simpan DO
                    </Button>
                </div>

            </div>
        </AppLayout>
    );
}
