import PriceDisplay from '@/components/priceDisplay';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import HeaderLayout from '@/layouts/header-layout';
import { type BreadcrumbItem, type CartItem, type CartItemOrPackage } from '@/types';
import { router } from '@inertiajs/react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

interface CheckoutProps {
    cartItems: CartItem[];
    totalQuantity: number;
    totalPrice: number;
    subtotal: number;
    shipping: number;
    tax: number;
    billingData: {
        first_name: string;
        last_name: string;
        email: string;
        phone: string;
        address: string;
        city: string;
        state: string;
        zip: string;
        country: string;
        notes: string;
    };
    shippingData: {
        first_name: string;
        last_name: string;
        email: string;
        phone: string;
        address: string;
        city: string;
        state: string;
        zip: string;
        country: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: route('dashboard') },
    { title: 'Medicines', href: route('orders.products') },
    { title: 'Cart', href: route('cart') },
    { title: 'Checkout', href: '#' },
];

export default function CheckoutPage({ billingData, shippingData }: CheckoutProps) {
    const [formData, setFormData] = useState({
        first_name: billingData?.first_name || '',
        last_name: billingData?.last_name || '',
        email: billingData?.email || '',
        phone: billingData?.phone || '',
        address: billingData?.address || '',
        city: billingData?.city || '',
        state: billingData?.state || '',
        zip: billingData?.zip || '',
        country: billingData?.country || 'Indonesia',
        notes: billingData?.notes || '',
        same_as_billing: false,
        shipping_first_name: shippingData?.first_name || billingData?.first_name || '',
        shipping_last_name: shippingData?.last_name || billingData?.last_name || '',
        shipping_email: shippingData?.email || billingData?.email || '',
        shipping_phone: shippingData?.phone || billingData?.phone || '',
        shipping_address: shippingData?.address || billingData?.address || '',
        shipping_city: shippingData?.city || billingData?.city || '',
        shipping_state: shippingData?.state || billingData?.state || '',
        shipping_zip: shippingData?.zip || billingData?.zip || '',
        shipping_country: shippingData?.country || billingData?.country || 'Indonesia',
    });

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    }, []);

    const handleCheckboxChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: checked,
        }));

        if (name === 'same_as_billing' && checked) {
            setFormData((prev) => ({
                ...prev,
                shipping_first_name: prev.first_name,
                shipping_last_name: prev.last_name,
                shipping_email: prev.email,
                shipping_phone: prev.phone,
                shipping_address: prev.address,
                shipping_city: prev.city,
                shipping_state: prev.state,
                shipping_zip: prev.zip,
            }));
        }
    }, []);

    const handleClearBilling = useCallback(() => {
        setFormData((prev) => ({
            ...prev,
            first_name: '',
            last_name: '',
            email: '',
            phone: '',
            address: '',
            city: '',
            state: '',
            zip: '',
            notes: '',
        }));
    }, []);

    const handleClearShipping = useCallback(() => {
        setFormData((prev) => ({
            ...prev,
            shipping_first_name: '',
            shipping_last_name: '',
            shipping_email: '',
            shipping_phone: '',
            shipping_address: '',
            shipping_city: '',
            shipping_state: '',
            shipping_zip: '',
        }));
    }, []);

    const handleSubmit = useCallback(
        (e: React.FormEvent) => {
            e.preventDefault();
            router.post(route('checkout.process'), formData);
        },
        [formData],
    );

    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    useEffect(() => {
        const storedCart = localStorage.getItem('cart');
        if (!storedCart) {
            localStorage.setItem('cartmsg', 'Your cart is empty.');
            window.location.href = route('cart');
        } else {
            const parsedCart: CartItemOrPackage[] = JSON.parse(storedCart);

            // Create a map to store items by product_id for quantity merging
            const itemMap = new Map<string, CartItem>();

            parsedCart.forEach((item) => {
                if ('isPackage' in item && item.isPackage) {
                    // Unwrap package items and merge with existing items
                    item.packageContents.forEach((content) => {
                        const existingItemKey = content.product_id.toString();
                        const existingItem = itemMap.get(existingItemKey);

                        if (existingItem) {
                            // Merge quantities if item already exists
                            itemMap.set(existingItemKey, {
                                ...existingItem,
                                quantity: existingItem.quantity + content.quantity,
                                total: existingItem.price * (existingItem.quantity + content.quantity) * (existingItem.content || 1),
                            });
                        } else {
                            // Add as new item
                            const newItem: CartItem = {
                                id: content.product_id.toString(),
                                product_id: content.product_id,
                                name: content.name,
                                slug: content.name.toLowerCase().replace(/\s+/g, '-'),
                                quantity: content.quantity,
                                price: content.price,
                                base_price: content.price,
                                image: content.image || '/products/Placeholder_Medicine.png',
                                order_unit: content.order_unit,
                                base_uom: content.base_uom,
                                content: content.content || 1,
                                weight: content.weight || 0,
                                total: content.price * content.quantity * (content.content || 1),
                                usage_direction: '',
                                description: '',
                                category_id: 0,
                            };
                            itemMap.set(existingItemKey, newItem);
                        }
                    });
                } else {
                    // Handle regular items, merging if they already exist in the map
                    const regularItem = item as CartItem;
                    // Use product_id if available, otherwise use id - convert to string for map key
                    const itemId = regularItem.product_id ? regularItem.product_id.toString() : regularItem.id.toString();

                    const existingItem = itemMap.get(itemId);
                    if (existingItem) {
                        // Merge quantities if item already exists (from a package)
                        itemMap.set(itemId, {
                            ...existingItem,
                            quantity: existingItem.quantity + regularItem.quantity,
                            total: existingItem.price * (existingItem.quantity + regularItem.quantity) * (existingItem.content || 1),
                        });
                    } else {
                        // Add as new item
                        itemMap.set(itemId, regularItem);
                    }
                }
            });

            // Convert the map back to an array
            setCartItems(Array.from(itemMap.values()));
        }
    }, []);

    useEffect(() => {
        const handlePageShow = (event: PageTransitionEvent) => {
            if (event.persisted) {
                window.location.reload();
            }
        };
        window.addEventListener('pageshow', handlePageShow);
        return () => {
            window.removeEventListener('pageshow', handlePageShow);
        };
    }, []);

    // Use useMemo to calculate totals only when cartItems change
    const { subtotal, ppn, grandTotal } = useMemo(() => {
        const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity * (item.content || 1), 0);
        const ppn = subtotal * 0.11;
        const grandTotal = subtotal + ppn;
        return { subtotal, ppn, grandTotal };
    }, [cartItems]);

    const shipping = 0;

    // Memoize cart items to prevent re-rendering of the entire table when possible
    const cartItemRows = useMemo(
        () =>
            cartItems.map((item) => (
                <TableRow key={item.id}>
                    <TableCell>
                        <img src={item.image} alt={item.name} className="h-12 w-12 rounded object-cover" />
                    </TableCell>
                    <TableCell className="text-xs font-medium">{item.name}</TableCell>
                    <TableCell className="text-xs">
                        {item.quantity} {item.order_unit}
                        {/* --- THEME CHANGE #6: Use muted color --- */}
                        <span className="block text-muted-foreground">
                            ({item.quantity * (item.content || 1)} {item.base_uom})
                        </span>
                    </TableCell>
                    <TableCell className="text-xs">
                        <PriceDisplay price={item.price} />
                    </TableCell>
                    <TableCell className="text-right text-xs">
                        <PriceDisplay price={item.price * item.quantity * (item.content || 1)} />
                    </TableCell>
                </TableRow>
            )),
        [cartItems],
    );
    console.log(grandTotal);

    return (
        <HeaderLayout breadcrumbs={breadcrumbs}>
            <div className="container mx-auto max-w-6xl p-2">
                {/* --- THEME CHANGE #1: Use foreground color for the main title --- */}
                <h1 className="mb-4 text-xl font-bold text-foreground">Checkout</h1>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-4">
                    {/* Billing & Shipping Information */}
                    <div className="grid grid-cols-1 gap-4 md:col-span-3 md:grid-cols-2">
                        {/* Billing Information */}
                        {/* --- THEME CHANGE #2: Use card colors for the container --- */}
                        <div className="rounded-lg bg-card p-3 text-card-foreground shadow-sm">
                            <div className="mb-3 flex items-center justify-between">
                                <h2 className="text-sm font-semibold">Billing Information</h2>
                                <button type="button" onClick={handleClearBilling} className="text-xs font-medium text-destructive hover:underline">
                                    Clear Form
                                </button>
                            </div>
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                {/* First Name */}
                                <div>
                                    {/* --- THEME CHANGE #3: Use muted color for labels --- */}
                                    <Label htmlFor="first_name" className="block text-xs font-medium text-muted-foreground">
                                        First Name *
                                    </Label>
                                    {/* --- THEME CHANGE #4: Remove hardcoded styles from Input --- */}
                                    <Input
                                        type="text"
                                        id="first_name"
                                        name="first_name"
                                        value={formData.first_name}
                                        onChange={handleInputChange}
                                        required
                                        className="mt-1 text-xs"
                                    />
                                </div>
                                {/* Last Name */}
                                <div>
                                    <Label htmlFor="last_name" className="block text-xs font-medium text-muted-foreground">
                                        Last Name *
                                    </Label>
                                    <Input
                                        type="text"
                                        id="last_name"
                                        name="last_name"
                                        value={formData.last_name}
                                        onChange={handleInputChange}
                                        required
                                        className="mt-1 text-xs"
                                    />
                                </div>
                                {/* Email */}
                                <div className="sm:col-span-2">
                                    <Label htmlFor="email" className="block text-xs font-medium text-muted-foreground">
                                        Email Address *
                                    </Label>
                                    <Input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                        className="mt-1 text-xs"
                                    />
                                </div>
                                {/* Phone */}
                                <div className="sm:col-span-2">
                                    <Label htmlFor="phone" className="block text-xs font-medium text-muted-foreground">
                                        Phone Number *
                                    </Label>
                                    <Input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        required
                                        className="mt-1 text-xs"
                                    />
                                </div>
                                {/* Address */}
                                <div className="sm:col-span-2">
                                    <Label htmlFor="address" className="block text-xs font-medium text-muted-foreground">
                                        Address *
                                    </Label>
                                    <Input
                                        type="text"
                                        id="address"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        required
                                        className="mt-1 text-xs"
                                    />
                                </div>
                                {/* City */}
                                <div>
                                    <Label htmlFor="city" className="block text-xs font-medium text-muted-foreground">
                                        City *
                                    </Label>
                                    <Input
                                        type="text"
                                        id="city"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        required
                                        className="mt-1 text-xs"
                                    />
                                </div>
                                {/* State */}
                                <div>
                                    <Label htmlFor="state" className="block text-xs font-medium text-muted-foreground">
                                        State/Province *
                                    </Label>
                                    <Input
                                        type="text"
                                        id="state"
                                        name="state"
                                        value={formData.state}
                                        onChange={handleInputChange}
                                        required
                                        className="mt-1 text-xs"
                                    />
                                </div>
                                {/* ZIP */}
                                <div>
                                    <Label htmlFor="zip" className="block text-xs font-medium text-muted-foreground">
                                        ZIP/Postal Code *
                                    </Label>
                                    <Input
                                        type="text"
                                        id="zip"
                                        name="zip"
                                        value={formData.zip}
                                        onChange={handleInputChange}
                                        required
                                        className="mt-1 text-xs"
                                    />
                                </div>
                                {/* Notes */}
                                <div className="sm:col-span-2">
                                    <Label htmlFor="notes" className="block text-xs font-medium text-muted-foreground">
                                        Order Notes (Optional)
                                    </Label>
                                    <textarea
                                        id="notes"
                                        name="notes"
                                        value={formData.notes}
                                        onChange={handleInputChange}
                                        rows={2}
                                        className="mt-1 block w-full rounded-md border border-input bg-background px-2 py-1 text-xs focus:border-ring focus:ring-ring"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Shipping Information */}
                        <div className="rounded-lg bg-card p-3 text-card-foreground shadow-sm">
                            <div className="mb-3 flex items-center justify-between">
                                <h2 className="text-sm font-semibold">Shipping Information</h2>
                                <div className="flex items-center gap-4">
                                    <button
                                        type="button"
                                        onClick={handleClearShipping}
                                        className="text-xs font-medium text-destructive hover:underline disabled:cursor-not-allowed disabled:no-underline disabled:opacity-50"
                                        disabled={formData.same_as_billing}
                                    >
                                        Clear Form
                                    </button>
                                    <div className="flex items-center">
                                        {/* --- THEME CHANGE #5: Style checkbox to match theme --- */}
                                        <Input
                                            type="checkbox"
                                            id="same_as_billing"
                                            name="same_as_billing"
                                            checked={formData.same_as_billing}
                                            onChange={handleCheckboxChange}
                                            className="h-3 w-3 rounded border-muted text-primary focus:ring-ring"
                                        />
                                        <Label htmlFor="same_as_billing" className="ml-2 block text-xs text-muted-foreground">
                                            Same as billing
                                        </Label>
                                    </div>
                                </div>
                            </div>

                            {!formData.same_as_billing && (
                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                    {/* Shipping Form fields (now correctly themed via Label and Input changes) */}
                                    <div>
                                        <Label htmlFor="shipping_first_name" className="block text-xs font-medium text-muted-foreground">
                                            First Name *
                                        </Label>
                                        <Input
                                            type="text"
                                            id="shipping_first_name"
                                            name="shipping_first_name"
                                            value={formData.shipping_first_name}
                                            onChange={handleInputChange}
                                            required
                                            className="mt-1 text-xs"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="shipping_last_name" className="block text-xs font-medium text-muted-foreground">
                                            Last Name *
                                        </Label>
                                        <Input
                                            type="text"
                                            id="shipping_last_name"
                                            name="shipping_last_name"
                                            value={formData.shipping_last_name}
                                            onChange={handleInputChange}
                                            required
                                            className="mt-1 text-xs"
                                        />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <Label htmlFor="shipping_email" className="block text-xs font-medium text-muted-foreground">
                                            Email *
                                        </Label>
                                        <Input
                                            type="email"
                                            id="shipping_email"
                                            name="shipping_email"
                                            value={formData.shipping_email}
                                            onChange={handleInputChange}
                                            required
                                            className="mt-1 text-xs"
                                        />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <Label htmlFor="shipping_address" className="block text-xs font-medium text-muted-foreground">
                                            Address *
                                        </Label>
                                        <Input
                                            type="text"
                                            id="shipping_address"
                                            name="shipping_address"
                                            value={formData.shipping_address}
                                            onChange={handleInputChange}
                                            required
                                            className="mt-1 text-xs"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="shipping_city" className="block text-xs font-medium text-muted-foreground">
                                            City *
                                        </Label>
                                        <Input
                                            type="text"
                                            id="shipping_city"
                                            name="shipping_city"
                                            value={formData.shipping_city}
                                            onChange={handleInputChange}
                                            required
                                            className="mt-1 text-xs"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="shipping_state" className="block text-xs font-medium text-muted-foreground">
                                            State/Province *
                                        </Label>
                                        <Input
                                            type="text"
                                            id="shipping_state"
                                            name="shipping_state"
                                            value={formData.shipping_state}
                                            onChange={handleInputChange}
                                            required
                                            className="mt-1 text-xs"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="shipping_zip" className="block text-xs font-medium text-muted-foreground">
                                            ZIP/Postal Code *
                                        </Label>
                                        <Input
                                            type="text"
                                            id="shipping_zip"
                                            name="shipping_zip"
                                            value={formData.shipping_zip}
                                            onChange={handleInputChange}
                                            required
                                            className="mt-1 text-xs"
                                        />
                                    </div>
                                </div>
                            )}

                            {formData.same_as_billing && (
                                <div className="mt-4 text-xs text-muted-foreground italic">Shipping address will be the same as billing address.</div>
                            )}
                        </div>

                        {/* Order Items Table */}
                        <div className="rounded-lg bg-card p-3 text-card-foreground shadow-sm md:col-span-2">
                            <h2 className="mb-3 text-sm font-semibold">Your Order Items</h2>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[80px] text-xs">Image</TableHead>
                                        <TableHead className="text-xs">Item</TableHead>
                                        <TableHead className="text-xs">Quantity</TableHead>
                                        <TableHead className="text-xs">Price</TableHead>
                                        <TableHead className="text-right text-xs">Subtotal</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>{cartItemRows}</TableBody>
                            </Table>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="md:col-span-1">
                        {/* --- THEME CHANGE #7: Use card colors for summary --- */}
                        <div className="self-start rounded-2xl border bg-card p-5 text-card-foreground shadow-lg lg:sticky lg:top-32">
                            <h2 className="mb-2 text-sm font-semibold">Order Summary</h2>
                            <div className="space-y-3">
                                <div className="space-y-1">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Subtotal</span>
                                        <PriceDisplay price={subtotal} />
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Shipping</span>
                                        {/* --- THEME CHANGE #8: Make "Free" text dark-mode compatible --- */}
                                        <span className="text-sm font-medium text-green-600 dark:text-green-400">
                                            {shipping === 0 ? 'Free' : <PriceDisplay price={shipping} />}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Tax</span>
                                        <PriceDisplay price={ppn} />
                                    </div>
                                    <div className="mt-3 flex justify-between border-t pt-5">
                                        <span className="text-sm font-semibold text-primary">Total</span>
                                        <PriceDisplay price={grandTotal} className="text-lg font-semibold text-primary" />
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    // --- THEME CHANGE #9: Use primary-foreground for button text ---
                                    className="mt-2 w-full rounded-md bg-primary px-3 py-2 text-xs text-primary-foreground hover:bg-primary/90"
                                >
                                    Proceed to Payment
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </HeaderLayout>
    );
}
