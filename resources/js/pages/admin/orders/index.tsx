import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Order, Paginated } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { format } from 'date-fns';
import { CheckCircle, Clock, Package, Truck, XCircle } from 'lucide-react';
import { useState } from 'react';
import { idrFormatter, currency} from '@/lib/utils';

const breadcrumbs = [
    { title: 'Dashboard', href: route('admin.dashboard') },
    { title: 'Orders', href: route('admin.orders.index') },
];

const statusStyle: Record<string, string> = {
    new: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    'dalam-pengiriman': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    diterima: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    dibatalkan: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

interface OrdersPageProps {
    orders: Paginated<Order>;
    totalOrders: number;
    newOrders: number;
    deliveringOrders: number;
    completedOrders: number;
    orderStatuses: Record<string, string>;
}

export default function OrdersIndex({
    orders,
    totalOrders = 0,
    newOrders = 0,
    deliveringOrders = 0,
    completedOrders = 0,
    orderStatuses,
}: OrdersPageProps) {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const getStatusIcon = (orderStatus: string) => {
        switch (orderStatus) {
            case 'new':
                return <Clock className="h-4 w-4" />;
            case 'dalam-pengiriman':
                return <Truck className="h-4 w-4" />;
            case 'diterima':
                return <CheckCircle className="h-4 w-4" />;
            case 'dibatalkan':
                return <XCircle className="h-4 w-4" />;
            default:
                return <Package className="h-4 w-4" />;
        }
    };

    // Filter orders based on search and status
    const filteredOrders = orders.data.filter((order) => {
        const matchesSearch =
            order.transaction_number.toLowerCase().includes(search.toLowerCase()) || order.user?.name?.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter === 'all' || order.status === statusFilter.toLowerCase();
        return matchesSearch && matchesStatus;
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Orders" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="space-y-6">
                    <div className="mb-8 space-y-0.5">
                        <h2 className="text-xl font-semibold tracking-tight text-foreground">Orders Management</h2>
                        <p className="text-sm text-muted-foreground">Manage and track customer orders</p>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                        <Card className="border border-border bg-card p-4">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-primary">{totalOrders}</div>
                                <div className="text-xs text-muted-foreground">Total Orders</div>
                            </div>
                        </Card>
                        <Card className="border border-border bg-card p-4">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{newOrders}</div>
                                <div className="text-xs text-muted-foreground">New Orders</div>
                            </div>
                        </Card>
                        <Card className="border border-border bg-card p-4">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{deliveringOrders}</div>
                                <div className="text-xs text-muted-foreground">On Delivery</div>
                            </div>
                        </Card>
                        <Card className="border border-border bg-card p-4">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-green-600 dark:text-green-400">{completedOrders}</div>
                                <div className="text-xs text-muted-foreground">Completed</div>
                            </div>
                        </Card>
                    </div>

                    {/* Filters */}
                    <Card className="border border-border bg-card p-4">
                        <div className="flex flex-col gap-4 md:flex-row">
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
                                        <SelectItem value="all">All Orders</SelectItem>
                                        {Object.entries(orderStatuses).map(([value, label]) => (
                                            <SelectItem key={value} value={value}>
                                                {label}
                                            </SelectItem>
                                        ))}
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
                                                <TableCell className="font-medium text-foreground">#{order.transaction_number}</TableCell>
                                                <TableCell className="text-foreground">{order.user?.name || 'N/A'}</TableCell>
                                                <TableCell className="text-foreground">
                                                    {format(new Date(order.created_at), 'MMM dd, yyyy')}
                                                </TableCell>
                                                <TableCell className="text-foreground">{idrFormatter.format(order.total_price)}</TableCell>
                                                <TableCell>
                                                    <Badge
                                                        className={`${statusStyle[order.status] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'} flex items-center gap-1`}
                                                    >
                                                        {getStatusIcon(order.status)}
                                                        {orderStatuses[order.status]}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Link href={route('admin.orders.show', order.id)} className="text-primary hover:text-primary/80">
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
