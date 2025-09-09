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

    const filteredOrders = orders.filter((order: Order) => {
        const matchesSearch = order.id.toString().includes(search) ||
                             (order.user?.name && order.user.name.toLowerCase().includes(search.toLowerCase()));
        const matchesStatus = statusFilter === "ALL" || order.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const formatStatus = (status: string) => {
        return status.charAt(0).toUpperCase() + status.slice(1);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Orders" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Order Management</h1>
                        <p className="text-muted-foreground">Manage and track all customer orders</p>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                            <Package className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalOrders}</div>
                            <p className="text-xs text-muted-foreground">All orders in the system</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">New Orders</CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{newOrders}</div>
                            <p className="text-xs text-muted-foreground">Orders awaiting processing</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">In Transit</CardTitle>
                            <Truck className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{deliveringOrders}</div>
                            <p className="text-xs text-muted-foreground">Orders being delivered</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Completed</CardTitle>
                            <CheckCircle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{completedOrders}</div>
                            <p className="text-xs text-muted-foreground">Successfully delivered orders</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Orders</CardTitle>
                        <CardDescription>View and manage all customer orders</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {/* Filters */}
                        <div className="mb-6 flex flex-col gap-4 md:flex-row">
                            <div className="flex-1">
                                <Input
                                    type="text"
                                    placeholder="Search by order ID or customer name..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                            <div className="w-full md:w-48">
                                <Select value={statusFilter} onValueChange={setStatusFilter}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Filter by status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ALL">All Statuses</SelectItem>
                                        <SelectItem value="new">New</SelectItem>
                                        <SelectItem value="delivering">Delivering</SelectItem>
                                        <SelectItem value="received">Received</SelectItem>
                                        <SelectItem value="canceled">Canceled</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Orders Table */}
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Order ID</TableHead>
                                    <TableHead>Customer</TableHead>
                                    <TableHead>Apotek</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Total</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredOrders.length > 0 ? (
                                    filteredOrders.map((order: Order) => (
                                        <TableRow key={order.id}>
                                            <TableCell className="font-medium">#{order.id}</TableCell>
                                            <TableCell>
                                                {order.user?.name || 'N/A'}
                                            </TableCell>
                                            <TableCell>
                                                {order.apotek?.name || 'N/A'}
                                            </TableCell>
                                            <TableCell>
                                                {format(new Date(order.created_at), 'MMM dd, yyyy')}
                                            </TableCell>
                                            <TableCell>
                                                Rp{Number(order.total_price).toLocaleString()}
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={`flex w-fit items-center gap-1 ${statusStyle[order.status] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'}`}>
                                                    {getStatusIcon(order.status)}
                                                    {formatStatus(order.status)}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Link
                                                    href={route('admin.orders.show', order.id)}
                                                    className="text-primary hover:underline"
                                                >
                                                    View
                                                </Link>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center">
                                            No orders found
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
