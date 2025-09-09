import AppLayout from "@/layouts/app-layout";
import { Head, Link, useForm } from '@inertiajs/react';
import { format } from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Package, Truck, CheckCircle, XCircle, Clock, User, MapPin } from "lucide-react";
import { Order, OrderItem } from '@/types';

const breadcrumbs = (orderId: string) => [
    { title: "Dashboard", href: "/dashboard" },
    { title: "Orders", href: "/admin/orders" },
    { title: `Order #${orderId}`, href: `/admin/orders/${orderId}` },
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

const formatStatus = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
};

interface OrderShowProps {
    order: Order;
}

export default function OrderShow({ order }: OrderShowProps) {
    const breadcrumbsArray = breadcrumbs(order.id.toString());

    // Initialize form with order items
    const { data, setData, patch, processing } = useForm({
        order_items: order.order_items?.map((item: OrderItem) => ({
            id: item.id,
            qty_delivered: item.qty_delivered || 0
        })) || [],
        status: order.status,
        shipped_at: order.shipped_at || null
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(route('admin.orders.update', order.id), {
            onSuccess: () => {
                // Reload the page to show updated data
                window.location.reload();
            }
        });
    };

    const updateQtyDelivered = (index: number, value: string) => {
        const updatedItems = [...data.order_items];
        updatedItems[index] = {
            ...updatedItems[index],
            qty_delivered: parseInt(value) || 0
        };
        setData('order_items', updatedItems);
    };

    const isDeliverable = order.status === 'new';

    return (
        <AppLayout breadcrumbs={breadcrumbsArray}>
            <Head title={`Order #${order.id}`} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Order Details</h1>
                        <p className="text-muted-foreground">View detailed information about order #{order.transaction_number}</p>
                    </div>
                    <Badge className={`flex items-center gap-1 text-sm ${statusStyle[order.status] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'}`}>
                        {getStatusIcon(order.status)}
                        {formatStatus(order.status)}
                    </Badge>
                </div>

                <div className="grid gap-4 lg:grid-cols-3">
                    {/* Customer Information */}
                    <Card className="lg:col-span-1">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-1">
                                <User className="h-5 w-5" />
                                Customer Information
                            </CardTitle>
                            <CardDescription>Details about the customer who placed this order</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-1">
                            <div>
                                <h4 className="text-sm font-medium text-muted-foreground">Name</h4>
                                <p className="text-sm font-medium">{order.user?.name || 'N/A'}</p>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-muted-foreground">Email</h4>
                                <p className="text-sm font-medium">{order.user?.email || 'N/A'}</p>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-muted-foreground">Apotek</h4>
                                <p className="text-sm font-medium">{order.user?.apotek?.name || 'N/A'}</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Order Information */}
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-1">
                                <Package className="h-5 w-5" />
                                Order Information
                            </CardTitle>
                            <CardDescription>Details about this order</CardDescription>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 gap-2 md:grid-cols-2">
                            <div>
                                <h4 className="text-sm font-medium text-muted-foreground">Order ID</h4>
                                <p className="text-sm font-medium">#{order.id}</p>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-muted-foreground">Order Date</h4>
                                <p className="text-sm font-medium">{format(new Date(order.created_at), 'MMMM dd, yyyy HH:mm')}</p>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-muted-foreground">Billing Name</h4>
                                <p className="text-sm font-medium">{order.billing_name || 'N/A'}</p>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-muted-foreground">Billing Email</h4>
                                <p className="text-sm font-medium">{order.billing_email || 'N/A'}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Shipping Information */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-1">
                            <MapPin className="h-5 w-5" />
                            Shipping Information
                        </CardTitle>
                        <CardDescription>Delivery address for this order</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
                            <div>
                                <h4 className="text-sm font-medium text-muted-foreground">Recipient</h4>
                                <p className="text-sm font-medium">{order.shipping_name || order.billing_name || 'N/A'}</p>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-muted-foreground">Address</h4>
                                <p className="text-sm font-medium">
                                    {order.shipping_address || order.billing_address || 'N/A'}
                                </p>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-muted-foreground">City/State/ZIP</h4>
                                <p className="text-sm font-medium">
                                    {[
                                        order.shipping_city || order.billing_city,
                                        order.shipping_state || order.billing_state,
                                        order.shipping_zip || order.billing_zip
                                    ].filter(Boolean).join(', ') || 'N/A'}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Order Items */}
                <form onSubmit={handleSubmit}>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Package className="h-5 w-5" />
                                Order Items
                            </CardTitle>
                            <CardDescription>Products included in this order</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead/>
                                        <TableHead>Product</TableHead>
                                        <TableHead className="text-right">Unit Price</TableHead>
                                        <TableHead className="text-center">Quantity</TableHead>
                                        <TableHead className="text-center">Satuan</TableHead>
                                        {isDeliverable && (
                                            <TableHead className="text-center">Qty Delivered</TableHead>
                                        )}
                                        <TableHead className="text-right">Total</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {order.order_items?.map((item: OrderItem, index: number) => (
                                        <TableRow key={item.id}>
                                            <TableCell>
                                                {item.product.image ? (
                                                    <img src={item.product.image} alt={item.product.name} className="h-16 w-16 rounded-lg object-cover" />
                                                ) : (
                                                    <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-gray-200 text-xs text-gray-500">
                                                        No Image
                                                    </div>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-sm font-medium">
                                                {item.product_name || 'N/A'}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                Rp{Number(item.unit_price).toLocaleString()}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                {item.quantity} {item.product.order_unit}
                                                <br />
                                                <span className="text-xs text-muted-foreground">
                                                    ({item.quantity * item.product.content} {item.product.base_uom})
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                {item.product.order_unit}
                                            </TableCell>
                                            {isDeliverable && (
                                                <TableCell className="text-center">
                                                    <Input
                                                        type="number"
                                                        min="0"
                                                        max={item.quantity}
                                                        value={data.order_items[index]?.qty_delivered || 0}
                                                        onChange={(e) => updateQtyDelivered(index, e.target.value)}
                                                        className="w-20 text-center"
                                                    />
                                                </TableCell>
                                            )}
                                            <TableCell className="text-right">
                                                Rp{Number(item.unit_price * item.quantity).toLocaleString()}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                                <TableFooter>
                                    <TableRow>
                                        <TableCell colSpan={isDeliverable ? 6 : 5} className="text-right font-medium">
                                            Subtotal
                                        </TableCell>
                                        <TableCell className="text-right">
                                            Rp{Number(order.total_price).toLocaleString()}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell colSpan={isDeliverable ? 6 : 5} className="text-right font-medium">
                                            Tax (11%)
                                        </TableCell>
                                        <TableCell className="text-right">
                                            Rp{Number(order.total_price * 0.11).toLocaleString()}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell colSpan={isDeliverable ? 6 : 5} className="text-right font-bold">
                                            Total
                                        </TableCell>
                                        <TableCell className="text-right font-bold">
                                            Rp{Number(order.total_price * 1.11).toLocaleString()}
                                        </TableCell>
                                    </TableRow>
                                </TableFooter>
                            </Table>
                        </CardContent>
                    </Card>

                    {/* Delivery Button */}
                    {isDeliverable && (
                        <div className="mt-4 flex justify-end">
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Updating...' : 'Mark as Shipped'}
                            </Button>
                        </div>
                    )}
                </form>

                {/* Back Button */}
                <div className="flex justify-end">
                    <Button variant="outline" asChild>
                        <Link href={route('admin.orders.index')}>
                            Back to Orders
                        </Link>
                    </Button>
                </div>
            </div>
        </AppLayout>
    );
}
