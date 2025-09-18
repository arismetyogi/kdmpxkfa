import React, { useState, useEffect } from "react";
import AppLayout from "@/layouts/app-layout";
import { Head, Link } from "@inertiajs/react";
import { type BreadcrumbItem, CartItem } from "@/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import HeaderLayout from '@/layouts/header-layout';

// 🔹 Breadcrumbs
const breadcrumbs: BreadcrumbItem[] = [
    { title: "Products", href: "/orders/products" },
    { title: "Purchase Order", href: "/orders/po" },
];

export default function PurchaseOrderPage() {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [ppnType] = useState("Include");
    const [paymentMethod, setPaymentMethod] = useState("Kredit");
    const [top, setTop] = useState("30");

    const [showCancelDialog, setShowCancelDialog] = useState(false);
    const [showSaveDialog, setShowSaveDialog] = useState(false);

    // Load cart items from localStorage
    useEffect(() => {
        const storedCart = localStorage.getItem("cart");
        if (storedCart) {
            setCartItems(JSON.parse(storedCart));
        }
    }, []);

    // 🔹 Dummy values
    const nomorSurat = "PO-2025-0001";
    const namaPengentri = "User";
    const namaKreditur = "Apotek Kimia Farma 123";

    // 🔹 Hitung subtotal, ppn, total
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const ppn = ppnType === "Tanpa" ? 0 : subtotal * 0.11;
    const total = subtotal + ppn;

    return (
        <HeaderLayout breadcrumbs={breadcrumbs}>
            <Head title="Purchase Order" />

            <div className="p-4 md:p-6 space-y-6">
                <h1 className="text-2xl font-bold text-blue-800">Purchase Order Form</h1>

                {/* Purchase Order Information */}
                <Card>
                    <CardHeader>
                        <CardTitle>Purchase Order Information</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label>Nomor Surat</Label>
                            <Input value={nomorSurat} disabled className="bg-gray-100" />
                        </div>
                        <div>
                            <Label>Nama Pengentri</Label>
                            <Input value={namaPengentri} disabled className="bg-gray-100" />
                        </div>
                        <div>
                            <Label>Nama Kreditur</Label>
                            <Input value={namaKreditur} disabled className="bg-gray-100" />
                        </div>
                        <div>
                            <Label>TOP (days)</Label>
                            <Input
                                type="number"
                                value={top}
                                onChange={(e) => setTop(e.target.value)}
                                disabled
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Payment Method */}
                <Card>
                    <CardHeader>
                        <CardTitle>Payment Method</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <RadioGroup
                            value={paymentMethod}
                            onValueChange={setPaymentMethod}
                            className="flex gap-6"
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="Debit" id="debit" />
                                <Label htmlFor="debit">Debit</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="Kredit" id="kredit" />
                                <Label htmlFor="kredit">Kredit</Label>
                            </div>
                        </RadioGroup>
                    </CardContent>
                </Card>

                {/* Ordered Items */}
                <Card>
                    <CardHeader>
                        <CardTitle>Ordered Items</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <Table className="min-w-[400px]">
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Item</TableHead>
                                        <TableHead>Qty</TableHead>
                                        <TableHead>Price</TableHead>
                                        <TableHead>Subtotal</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {cartItems.map((item) => (
                                        <TableRow key={item.sku}>
                                            <TableCell>{item.name}</TableCell>
                                            <TableCell>{item.quantity}</TableCell>
                                            <TableCell>Rp {item.price.toLocaleString()}</TableCell>
                                            <TableCell>
                                                Rp {(item.price * item.quantity).toLocaleString()}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        {/* 🔹 Summary (Subtotal, PPN, Total) */}
                        <div className="flex flex-col items-end mt-6 space-y-2 w-full md:w-64">
                            <div className="flex justify-between w-full text-gray-700">
                                <span>Subtotal</span>
                                <span>Rp {subtotal.toLocaleString()}</span>
                            </div>
                            {ppnType !== "Tanpa" && (
                                <div className="flex justify-between w-full text-gray-700">
                                    <span>PPN (11%)</span>
                                    <span>Rp {ppn.toLocaleString()}</span>
                                </div>
                            )}
                            <div className="flex justify-between w-full border-t pt-2 mt-2 text-xl font-bold text-blue-800">
                                <span>Total</span>
                                <span>Rp {total.toLocaleString()}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex flex-col md:flex-row justify-end gap-3">
                    <Button variant="outline" onClick={() => setShowCancelDialog(true)}>
                        Cancel
                    </Button>
                    <Button onClick={() => setShowSaveDialog(true)}>
                        Simpan Purchase Order
                    </Button>
                </div>
            </div>

            {/* Cancel Confirmation Dialog */}
            <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Batalkan Purchase Order?</DialogTitle>
                        <DialogDescription>
                            Apakah Anda yakin ingin membatalkan? Perubahan tidak akan disimpan.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setShowCancelDialog(false)}>
                            Tidak
                        </Button>
                        <Link href="/orders/products">
                            <Button variant="destructive">Ya, Batalkan</Button>
                        </Link>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Save Confirmation Dialog */}
            <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Simpan Purchase Order?</DialogTitle>
                        <DialogDescription>
                            Apakah Anda yakin ingin menyimpan Purchase Order ini?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
                            Batal
                        </Button>
                        <Link href={route('orders.products')}>
                            <Button>Ya, Simpan</Button>
                        </Link>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </HeaderLayout>
    );
}
