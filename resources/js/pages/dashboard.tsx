import { Card, CardContent } from "@/components/ui/card";
import AppLayout from "@/layouts/header-layout";
import { type BreadcrumbItem } from "@/types";
import { Head } from "@inertiajs/react";
import { Package, Wallet } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const breadcrumbs: BreadcrumbItem[] = [
    { title: "Dashboard", href: "/dashboard" },
];

export default function Dashboard() {
    // 🔹 Data dummy transaksi (bisa diambil dari API/backend)
    const transactions = [
        { id: "TO-001", items: 80, price: 2000000, date: "2025-07-18" },
        { id: "TO-002", items: 56, price: 918000, date: "2025-06-18" },
        { id: "TO-003", items: 12, price: 199800, date: "2025-08-18" },
        { id: "TO-004", items: 21, price: 555000, date: "2025-09-18" },
    ];

    const totalTransactions = transactions.length;
    const totalItems = transactions.reduce((sum, t) => sum + t.items, 0);
    const totalSpent = transactions.reduce((sum, t) => sum + t.price, 0);

    // 🔹 Contoh data grafik bulanan
    const chartData = [
        { month: "Jan", transaksi: 3 },
        { month: "Feb", transaksi: 5 },
        { month: "Mar", transaksi: 2 },
        { month: "Apr", transaksi: 4 },
        { month: "May", transaksi: 1 },
        { month: "Jun", transaksi: 3 },
        { month: "Jul", transaksi: 6 },
        { month: "Aug", transaksi: 4 },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 overflow-x-auto">
                {/* Summary Cards */}
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                    <Card className="rounded-xl shadow-sm border border-border bg-card">
                        <CardContent className="p-6 flex items-center gap-4">
                            <div className="p-3 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300">
                                <Package size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Total Transaksi</p>
                                <h3 className="text-xl font-bold text-foreground">{totalTransactions}</h3>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="rounded-xl shadow-sm border border-border bg-card">
                        <CardContent className="p-6 flex items-center gap-4">
                            <div className="p-3 rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-300">
                                <Package size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Jumlah Barang Dibeli</p>
                                <h3 className="text-xl font-bold text-foreground">{totalItems}</h3>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="rounded-xl shadow-sm border border-border bg-card">
                        <CardContent className="p-6 flex items-center gap-4">
                            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-300">
                                <Wallet size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Total Pengeluaran</p>
                                <h3 className="text-xl font-bold text-foreground">
                                    Rp {totalSpent.toLocaleString("id-ID")},00
                                </h3>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Grafik Transaksi Bulanan */}
                <Card className="rounded-xl shadow-sm border border-border bg-card">
                    <CardContent className="p-4 md:p-6">
                        <h3 className="text-lg font-bold mb-4 text-foreground">Statistik Transaksi per Bulan</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                                <YAxis stroke="hsl(var(--muted-foreground))" />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'hsl(var(--background))',
                                        borderColor: 'hsl(var(--border))',
                                        color: 'hsl(var(--foreground))'
                                    }}
                                />
                                <Bar dataKey="transaksi" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Transaksi Terbaru */}
                <Card className="rounded-xl shadow-sm border border-border bg-card">
                    <CardContent className="p-4 md:p-6">
                        <h3 className="text-lg font-bold mb-4 text-foreground">Transaksi Terbaru</h3>
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm border-collapse">
                                <thead className="bg-muted">
                                    <tr>
                                        <th className="px-4 py-2 text-left text-muted-foreground">ID</th>
                                        <th className="px-4 py-2 text-left text-muted-foreground">Tanggal</th>
                                        <th className="px-4 py-2 text-left text-muted-foreground">Barang</th>
                                        <th className="px-4 py-2 text-left text-muted-foreground">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions.map((t) => (
                                        <tr key={t.id} className="border-b border-border hover:bg-muted/50">
                                            <td className="px-4 py-2 text-foreground">{t.id}</td>
                                            <td className="px-4 py-2 text-foreground">{t.date}</td>
                                            <td className="px-4 py-2 text-foreground">{t.items}</td>
                                            <td className="px-4 py-2 text-foreground">Rp {t.price.toLocaleString("id-ID")},00</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
