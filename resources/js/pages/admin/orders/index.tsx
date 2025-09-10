import AppLayout from "@/layouts/app-layout";
import { Head, Link } from '@inertiajs/react';
import { useState } from "react";
import { format } from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Package, Truck, CheckCircle, XCircle, Clock } from "lucide-react";
import {Order} from "@/types";

const breadcrumbs = [
    { title: "Dashboard", href: "/dashboard" },
    { title: "Orders", href: "/admin/orders" },
];

const statusStyle: Record<string, string> = {
    new: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    delivering: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    received: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    canceled: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

const getStatusIcon = (status: string) => {
    switch (status) {
        case 'new':
            return <Clock className="h-4 w-4" />;
        case 'delivering':
            return <Truck className="h-4 w-4" />;
        case 'received':
            return <CheckCircle className="h-4 w-4" />;
        case 'canceled':
            return <XCircle className="h-4 w-4" />;
        default:
            return <Package className="h-4 w-4" />;
    }
};

interface OrdersPageProps {
    orders: Order[];
    totalOrders: number;
    newOrders: number;
    deliveringOrders: number;
    completedOrders: number;
}

export default function OrdersIndex({ orders, totalOrders = 0, newOrders = 0, deliveringOrders = 0, completedOrders = 0 }: OrdersPageProps) {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");

    // Filter orders based on search and status
    const filteredOrders = orders.filter(order => {
        const matchesSearch = order.transaction_number.toLowerCase().includes(search.toLowerCase()) ||
            order.user?.name?.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter === "ALL" || order.status === statusFilter.toLowerCase();
        return matchesSearch && matchesStatus;
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Orders" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <div className="space-y-6">
                    <div className="mb-8 space-y-0.5">
                        <h2 className="text-xl font-semibold tracking-tight text-foreground">Orders Management</h2>
                        <p className="text-sm text-muted-foreground">Manage and track customer orders</p>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Card className="p-4 border border-border bg-card">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-primary">{totalOrders}</div>
                                <div className="text-xs text-muted-foreground">Total Orders</div>
                            </div>
                        </Card>
                        <Card className="p-4 border border-border bg-card">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{newOrders}</div>
                                <div className="text-xs text-muted-foreground">New Orders</div>
                            </div>
                        </Card>
                        <Card className="p-4 border border-border bg-card">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{deliveringOrders}</div>
                                <div className="text-xs text-muted-foreground">Delivering</div>
                            </div>
                        </Card>
                        <Card className="p-4 border border-border bg-card">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-green-600 dark:text-green-400">{completedOrders}</div>
                                <div className="text-xs text-muted-foreground">Completed</div>
                            </div>
                        </Card>
                    </div>

                    {/* Filters */}
                    <Card className="p-4 border border-border bg-card">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <Input
                                    placeholder="Search by transaction number or customer name..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full border-border bg-background text-foreground placeholder:text-muted-foreground"
                                />
                            </div>
                            <div className="w-full md:w-48">
                                <Select value={statusFilter} onValueChange={setStatusFilter}>
                                    <SelectTrigger className="w-full border-border bg-background text-foreground">
                                        <SelectValue placeholder="Filter by status" />
                                    </SelectTrigger>
                                    <SelectContent className="border-border bg-background text-foreground">
                                        <SelectItem value="ALL">All Statuses</SelectItem>
                                        <SelectItem value="NEW">New</SelectItem>
                                        <SelectItem value="DELIVERING">Delivering</SelectItem>
                                        <SelectItem value="RECEIVED">Received</SelectItem>
                                        <SelectItem value="CANCELED">Canceled</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </Card>

                    {/* Orders Table */}
                    <Card className="border border-border bg-card">
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold text-foreground">Orders List</CardTitle>
                            <CardDescription className="text-muted-foreground">View and manage customer orders</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="hover:bg-muted/50">
                                            <TableHead className="text-muted-foreground">Order ID</TableHead>
                                            <TableHead className="text-muted-foreground">Customer</TableHead>
                                            <TableHead className="text-muted-foreground">Date</TableHead>
                                            <TableHead className="text-muted-foreground">Amount</TableHead>
                                            <TableHead className="text-muted-foreground">Status</TableHead>
                                            <TableHead className="text-right text-muted-foreground">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredOrders.map((order) => (
                                            <TableRow key={order.id} className="border-b border-border hover:bg-muted/50">
                                                <TableCell className="font-medium text-foreground">
                                                    #{order.transaction_number}
                                                </TableCell>
                                                <TableCell className="text-foreground">
                                                    {order.user?.name || 'N/A'}
                                                </TableCell>
                                                <TableCell className="text-foreground">
                                                    {format(new Date(order.created_at), 'MMM dd, yyyy')}
                                                </TableCell>
                                                <TableCell className="text-foreground">
                                                    Rp{Number(order.total_price).toLocaleString()}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge className={`${statusStyle[order.status] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'} flex items-center gap-1`}>
                                                        {getStatusIcon(order.status)}
                                                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Link
                                                        href={route('admin.orders.show', order.id)}
                                                        className="text-primary hover:text-primary/80"
                                                    >
                                                        View Details
                                                    </Link>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
