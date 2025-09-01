import AppLayout from "@/layouts/app-layout";
import { Card } from "@/components/ui/card";
import { CheckCircle2, FileText } from "lucide-react";
import { Head } from "@inertiajs/react";
import { Button } from "@/components/ui/button";

export default function DeliverOrder() {
    return (
        <AppLayout
            breadcrumbs={[
                { title: "Dashboard", href: "/dashboard" },
                { title: "Purchase Orders", href: "/purchase-orders" },
                { title: "PO 001", href: "#" },
            ]}
        >
            <Head title="Purchase Order PO 001" />

            <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold">Purchase Orders PO 001</h1>
                        <p className="text-gray-500 text-sm">
                            Detail View of Selected Purchase Orders
                        </p>
                    </div>
                    <div className="flex items-center gap-2 bg-green-50 text-green-600 px-4 py-2 rounded-lg shadow-sm">
                        <CheckCircle2 className="w-5 h-5" />
                        <span className="font-semibold">ORDER ACCEPTED</span>
                    </div>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Section */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Order Info */}
                        <Card className="p-4">
                            <h2 className="font-semibold mb-3">Order Information</h2>
                            <div className="grid sm:grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-gray-500">Purchase Order ID</p>
                                    <p className="font-medium">PO 001</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Nama Koperasi</p>
                                    <p className="font-medium">Koperasi Desa Purworejo</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Tanggal Order</p>
                                    <p className="font-medium">Aug 17 2025</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Nama Pengentri</p>
                                    <p className="font-medium">Bambang Sadoyo</p>
                                </div>
                            </div>
                        </Card>

                        {/* Products */}
                        <Card className="p-4">
                            <h2 className="font-semibold mb-3">Products (12 Items)</h2>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm border-collapse">
                                    <thead className="bg-gray-50 text-gray-600">
                                    <tr>
                                        <th className="p-2 text-left">Product Name</th>
                                        <th className="p-2 text-center">Quantity</th>
                                        <th className="p-2 text-right">Unit Price</th>
                                        <th className="p-2 text-right">Sub Total</th>
                                    </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                    <tr>
                                        <td className="p-2">Aspirin 100gr</td>
                                        <td className="p-2 text-center">10</td>
                                        <td className="p-2 text-right">Rp10.000,00</td>
                                        <td className="p-2 text-right">Rp100.000,00</td>
                                    </tr>
                                    <tr>
                                        <td className="p-2">Vitamin C 500gr</td>
                                        <td className="p-2 text-center">9</td>
                                        <td className="p-2 text-right">Rp15.000,00</td>
                                        <td className="p-2 text-right">Rp135.000,00</td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="flex justify-end mt-3 text-sm">
                                <div className="font-semibold">Sub Total Value: Rp235.000,00</div>
                            </div>
                        </Card>
                    </div>

                    {/* Right Section */}
                    <div className="space-y-6">
                        {/* Delivery Info */}
                        <Card className="p-4 space-y-3">
                            <h2 className="font-semibold">Delivery Information</h2>
                            <div className="text-sm text-gray-700">
                                <p className="font-medium">Tujuan Delivery</p>
                                <p className="text-gray-600">
                                    Jl. Jenderal Sudirman No.21 KAV 4 <br />
                                    RT 11 / RW 13 Kec. Banyuwangi, Prov. Jawa Tengah
                                </p>
                            </div>
                            <div className="text-sm">
                                <p className="font-medium">Estimated Delivery</p>
                                <p className="text-gray-600">1–2 Business Days</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-gray-500">Delivery Order Create Date</p>
                                    <p className="font-medium">Aug 17 2025</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Received Date</p>
                                    <p className="font-medium">-</p>
                                </div>
                            </div>
                        </Card>

                        {/* Order Summary */}
                        <Card className="p-4 space-y-2">
                            <h2 className="font-semibold">Order Summary</h2>
                            <div className="flex justify-between text-sm">
                                <span>Total Products</span>
                                <span>2</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span>Total Quantity</span>
                                <span>12</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span>Sub Total Order</span>
                                <span>Rp235.000,00</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span>PPN (11%)</span>
                                <span>Rp25.850,00</span>
                            </div>
                            <hr className="my-2" />
                            <div className="flex justify-between font-bold text-lg">
                                <span>Total Value</span>
                                <span>Rp260.850,00</span>
                            </div>

                            {/* Button Buat DO */}
                            <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2">
                                <FileText className="w-4 h-4" />
                                Buat Delivery Order
                            </Button>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
