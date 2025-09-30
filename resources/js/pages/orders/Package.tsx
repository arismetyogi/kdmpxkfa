import PriceDisplay from '@/components/priceDisplay';
<<<<<<< HEAD
import QuantityInput from '@/components/QuantityInput';
=======
>>>>>>> KDMP/master
import ScrollToTopButton from '@/components/ScrollToTop';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import HeaderLayout from '@/layouts/header-layout';
import { cn } from '@/lib/utils';
import { BreadcrumbItem, CartItem, Product } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Search, ShoppingCart } from 'lucide-react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

// --- Type Definitions ---
interface PackageProduct extends Product {
    assignedQuantity: number;
    maxQuantity: number;
    content: number;
    order_unit: string;
}

interface PackagePageProps {
    products: PackageProduct[];
}
function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]); // Only re-run the effect if value or delay changes

    return debouncedValue;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Paket Merah Putih', href: '#' },
];

<<<<<<< HEAD
=======
// --- Sub-component: Quantity Input ---
interface QuantityInputProps {
    value: number;
    onChange: (newValue: number) => void;
    decrementDisabled?: boolean;
    incrementDisabled?: boolean;
}

const QuantityInput: React.FC<QuantityInputProps> = ({ value, onChange, decrementDisabled, incrementDisabled }) => (
    <div className="justify-cente flex items-center">
        <Button
            type="button"
            size="icon"
            variant="outline"
            onClick={() => onChange(value - 1)}
            disabled={decrementDisabled}
            className="h-8 w-8 rounded-full"
        >
            <Minus className="h-4 w-4" />
        </Button>
        <div className="font-base w-10 text-center text-lg">{value}</div>
        <Button
            type="button"
            size="icon"
            variant="outline"
            onClick={() => onChange(value + 1)}
            disabled={incrementDisabled}
            className="h-8 w-8 rounded-full"
        >
            <Plus className="h-4 w-4" />
        </Button>
    </div>
);

>>>>>>> KDMP/master
// --- Sub-component: Product Table Row (Updated for Mobile) ---
interface ProductTableRowProps {
    product: PackageProduct;
    onQuantityChange: (productId: number, newQuantity: number) => void;
}

const ProductTableRow: React.FC<ProductTableRowProps> = React.memo(({ product, onQuantityChange }) => {
    const isExcluded = product.assignedQuantity === 0;

    const handleBoxQuantityUpdate = (newBoxQuantity: number) => {
        const rawQuantity = newBoxQuantity * product.content;
        const validatedQuantity = Math.max(0, Math.min(rawQuantity, product.maxQuantity));
        const finalQuantity = Math.floor(validatedQuantity / product.content) * product.content;
        onQuantityChange(product.id, finalQuantity);
    };

    const handleMobileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newBoxQuantity = parseInt(e.target.value, 10) || 0;
        handleBoxQuantityUpdate(newBoxQuantity);
    };

    const handleExclude = () => onQuantityChange(product.id, 0);
    const handleInclude = () => onQuantityChange(product.id, product.maxQuantity);

    const assignedBoxQuantity = product.assignedQuantity / product.content;
    const maxBoxQuantity = product.maxQuantity / product.content;
    const pricePerBox = product.price * product.content;

    return (
        <TableRow className={cn('transition-all', isExcluded && 'bg-muted/50')}>
            <TableCell className={cn('hidden p-2 md:table-cell', isExcluded && 'opacity-60')}>
                <img
                    src={product.image || '/products/Placeholder_Medicine.png'}
                    alt={product.name}
                    className="h-16 w-16 rounded-md border object-cover"
                    onError={({ currentTarget }) => {
                        currentTarget.src = '/products/Placeholder_Medicine.png';
                    }}
                />
            </TableCell>
<<<<<<< HEAD
            <TableCell className={cn('px-2 py-2 font-medium sm:px-4', isExcluded && 'opacity-60')}>
                <p className="line-clamp-2 text-xs font-medium sm:text-base">{product.name}</p>
=======
            {/* MODIFICATION: Reduced horizontal padding on smallest screens */}
            <TableCell className="px-2 py-2 font-medium sm:px-4">
                <p className="line-clamp-2 text-sm font-medium sm:text-base">{product.name}</p>
>>>>>>> KDMP/master

                <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground sm:hidden">
                    <PriceDisplay price={pricePerBox} currency="" decimal="hidden" />
                    <span>/ {product.order_unit}</span>
                </div>

                <p className="hidden text-xs text-muted-foreground sm:block">{product.order_unit}</p>
            </TableCell>
<<<<<<< HEAD
            <TableCell className={cn('hidden px-2 text-center sm:table-cell', isExcluded && 'opacity-60')}>
=======

            <TableCell className="hidden px-2 text-center sm:table-cell">
>>>>>>> KDMP/master
                <PriceDisplay price={pricePerBox} />
            </TableCell>
            <TableCell className={cn('hidden p-2 text-center lg:table-cell', isExcluded && 'opacity-60')}>{maxBoxQuantity}</TableCell>
            <TableCell className={cn('p-2', isExcluded && 'opacity-60')}>
                <div className="flex justify-center">
                    <div className="hidden lg:flex">
                        <QuantityInput
                            value={assignedBoxQuantity}
                            onChange={handleBoxQuantityUpdate}
                            decrementDisabled={product.assignedQuantity <= 0}
                            incrementDisabled={product.assignedQuantity >= product.maxQuantity}
                        />
                    </div>
                    <div className="lg:hidden">
                        <Input
                            className="h-9 w-12 text-center focus-visible:ring-0"
                            value={assignedBoxQuantity}
                            onChange={handleMobileInputChange}
                            min={0}
                            max={maxBoxQuantity}
                        />
                    </div>
                </div>
            </TableCell>
<<<<<<< HEAD
            <TableCell className={cn('px-2 text-center font-medium', isExcluded && 'opacity-60')}>
                <PriceDisplay price={product.price * product.assignedQuantity} currency="" className="text-xs lg:hidden" />
                <PriceDisplay price={product.price * product.assignedQuantity} className="hidden lg:block" />
            </TableCell>
            <TableCell className="px-2 text-center">
                {isExcluded ? (
                    <Button variant="default" size="sm" onClick={handleInclude} className="px-2">
=======

            <TableCell className="px-2 text-center font-medium">
                <PriceDisplay price={product.price * product.assignedQuantity} currency="" className="text-sm lg:hidden" />
                <PriceDisplay price={product.price * product.assignedQuantity} className="hidden lg:block" />
            </TableCell>
            {/* MODIFICATION: Reduced horizontal padding for more space */}
            <TableCell className="px-2 text-center">
                {isExcluded ? (
                    <Button variant="default" size="sm" onClick={handleInclude}>
>>>>>>> KDMP/master
                        Include
                    </Button>
                ) : (
                    <Button variant="destructive" size="sm" onClick={handleExclude} className="px-2">
                        Exclude
                    </Button>
                )}
            </TableCell>
        </TableRow>
    );
});

// --- Sub-component: Product List Table (Updated for Mobile) ---
interface ProductListTableProps {
    products: PackageProduct[];
    onQuantityChange: (productId: number, newQuantity: number) => void;
}

const ProductListTable: React.FC<ProductListTableProps> = ({ products, onQuantityChange }) => (
<<<<<<< HEAD
    <Table className="w-full table-fixed border">
        <TableHeader>
            <TableRow>
                <TableHead className="hidden w-[80px] p-2 md:table-cell">Image</TableHead>
                <TableHead className="px-2 sm:px-4">Product Name</TableHead>
                <TableHead className="hidden w-[100px] px-2 text-center sm:table-cell">Price</TableHead>
                <TableHead className="hidden w-[70px] px-2 text-center lg:table-cell">Max</TableHead>
                <TableHead className="w-[65px] px-2 text-center lg:w-[150px]">Qty</TableHead>
                <TableHead className="w-[100px] px-2 text-center">Subtotal</TableHead>
                <TableHead className="w-[80px] px-2 text-center">Action</TableHead>
=======
    // MODIFICATION: Added 'table-fixed' to enforce column widths and prevent content from causing overflow.
    <Table className="w-full table-fixed border">
        <TableHeader>
            <TableRow>
                {/* MODIFICATION: Explicit widths are set for most columns to control the layout. */}
                {/* The "Product Name" column will fill the remaining space. */}
                <TableHead className="hidden w-[80px] p-2 sm:table-cell">Image</TableHead>
                <TableHead className="px-2 sm:px-4">Product Name</TableHead>
                <TableHead className="hidden w-[100px] px-2 text-center sm:table-cell">Price</TableHead>
                <TableHead className="hidden w-[70px] px-2 text-center lg:table-cell">Max</TableHead>
                <TableHead className="w-[90px] px-2 text-center lg:w-[150px]">Qty</TableHead>
                <TableHead className="w-[100px] px-2 text-center">Subtotal</TableHead>
                <TableHead className="w-[100px] px-2 text-center sm:w-[110px]">Action</TableHead>
>>>>>>> KDMP/master
            </TableRow>
        </TableHeader>
        <TableBody>
            {products.length > 0 ? (
                products.map((product) => <ProductTableRow key={product.id} product={product} onQuantityChange={onQuantityChange} />)
            ) : (
                <TableRow>
                    {/* MODIFICATION: colSpan updated to match the new number of columns */}
                    <TableCell colSpan={7} className="h-24 text-center">
                        No products found.
                    </TableCell>
                </TableRow>
            )}
        </TableBody>
    </Table>
);

// --- Sub-component: Order Summary Card ---
interface OrderSummaryCardProps {
    activeProducts: PackageProduct[];
    summary: { subtotal: number; tax: number; total: number };
    onCheckout: () => void;
}

const OrderSummaryCard: React.FC<OrderSummaryCardProps> = ({ activeProducts, summary, onCheckout }) => (
    <div className="sticky top-24">
        <Card>
            <CardContent className="px-6">
                <h2 className="mb-4 text-xl font-bold">Order Summary</h2>
<<<<<<< HEAD
                <ScrollArea className="-mr-4 h-64 pr-4">
=======
                <ScrollArea className="-mr-4 h-66 pr-4">
>>>>>>> KDMP/master
                    <div className="space-y-4">
                        {activeProducts.length > 0 ? (
                            activeProducts.map((product) => (
                                <div key={product.id} className="flex items-start justify-between">
                                    <div>
                                        <h4 className="line-clamp-2 text-sm font-medium">{product.name}</h4>
                                        <p className="text-xs text-muted-foreground">
                                            Qty: {product.assignedQuantity / product.content} {product.order_unit}
                                        </p>
                                    </div>
                                    <div className="shrink-0 pl-4 text-right">
                                        <PriceDisplay price={product.price * product.assignedQuantity} className="text-sm font-medium" />
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="py-4 text-center text-sm text-muted-foreground">No items included in the package.</p>
                        )}
                    </div>
                </ScrollArea>
                <div className="mt-6 border-t pt-4">
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <p>Subtotal</p>
                            <PriceDisplay price={summary.subtotal} />
                        </div>
                        <div className="flex justify-between text-sm">
                            <p>Tax (11%)</p>
                            <PriceDisplay price={summary.tax} />
                        </div>
                        <div className="mt-2 flex justify-between border-t pt-2 text-base font-bold">
                            <p>Total</p>
                            <PriceDisplay price={summary.total} />
                        </div>
                    </div>
                    <Button onClick={onCheckout} disabled={activeProducts.length === 0} className="mt-6 w-full" size="lg">
                        <ShoppingCart className="mr-2 h-5 w-5" />
                        Proceed to Checkout
                    </Button>
                </div>
            </CardContent>
        </Card>
    </div>
);

<<<<<<< HEAD
// --- Mobile Checkout Bar ---
=======
// --- MODIFICATION: Redesigned Mobile Checkout Bar for better responsiveness ---
>>>>>>> KDMP/master
interface MobileCheckoutBarProps {
    total: number;
    onCheckout: () => void;
    disabled: boolean;
}

const MobileCheckoutBar: React.FC<MobileCheckoutBarProps> = ({ total, onCheckout, disabled }) => (
    <div className="fixed right-0 bottom-0 left-0 z-10 border-t bg-background shadow-lg lg:hidden">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 px-4 pt-3 pb-4 sm:px-6">
            <div className="flex flex-col items-center">
                <p className="text-sm text-muted-foreground">Total Price</p>
                <PriceDisplay price={total} className="text-2xl font-bold text-primary" />
            </div>
            <Button onClick={onCheckout} disabled={disabled} size="lg" className="w-full max-w-sm">
                <ShoppingCart className="mr-2 h-5 w-5" />
                Proceed to Checkout
            </Button>
        </div>
    </div>
);

// --- Main Page Component ---
export default function PackagePage({ products: initialProducts }: PackagePageProps) {
    const [packageProducts, setPackageProducts] = useState<PackageProduct[]>(initialProducts);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortOrder, setSortOrder] = useState('default');
    const debouncedSearchQuery = useDebounce(searchQuery, 500); // 500ms debounce delay

    const updateQuantity = useCallback((productId: number, newQuantity: number) => {
        setPackageProducts((prev) =>
            prev.map((p) => (p.id === productId ? { ...p, assignedQuantity: Math.max(0, Math.min(newQuantity, p.maxQuantity)) } : p)),
        );
    }, []);

    const handleIncludeAll = () => {
        setPackageProducts((prev) => prev.map((p) => ({ ...p, assignedQuantity: p.maxQuantity })));
    };

    const activePackageProducts = useMemo(() => packageProducts.filter((p) => p.assignedQuantity > 0), [packageProducts]);

    const displayedProducts = useMemo(() => {
        let products = [...packageProducts];
        if (debouncedSearchQuery.trim() !== '') {
            products = products.filter((p) => p.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()));
        }
        switch (sortOrder) {
            case 'quantity':
                return products.sort((a, b) => {
                    if (a.assignedQuantity > 0 && b.assignedQuantity === 0) return -1;
                    if (a.assignedQuantity === 0 && b.assignedQuantity > 0) return 1;
                    return b.assignedQuantity - a.assignedQuantity;
                });
            default:
                return products.sort((a, b) => a.name.localeCompare(b.name));
        }
    }, [packageProducts, debouncedSearchQuery, sortOrder]);

    const summary = useMemo(() => {
        const subtotal = activePackageProducts.reduce((total, p) => total + p.price * p.assignedQuantity, 0);
        const tax = subtotal * 0.11;
        const total = subtotal + tax;
        return { subtotal, tax, total };
    }, [activePackageProducts]);

    const addToCheckout = () => {
        try {
            const cart: CartItem[] = activePackageProducts.map((p) => ({
                ...p,
                quantity: p.assignedQuantity / p.content,
                total: p.price * p.assignedQuantity,
            }));
            localStorage.setItem('cart', JSON.stringify(cart));
            router.visit(route('checkout'));
        } catch (error) {
            console.error('Error adding products to checkout:', error);
            alert('There was an error creating your checkout. Please try again.');
        }
    };

    const isCheckoutDisabled = activePackageProducts.length === 0;

    return (
        <HeaderLayout breadcrumbs={breadcrumbs}>
            <Head title="Health Package" />
            {/* MODIFICATION: Increased bottom padding to prevent content from being hidden by the MobileCheckoutBar */}
            <div className="mx-auto max-w-7xl px-4 py-8 pb-32 sm:px-6 lg:px-8 lg:pb-8">
                <div className="flex flex-col gap-8 lg:flex-row">
                    <div className="flex w-full flex-col gap-6 lg:w-2/3">
                        <div>
                            <h1 className="text-3xl font-bold">Paket Koperasi Merah Putih</h1>
                            <p className="mt-2 text-muted-foreground">Manage item quantities below. Excluded items won't be added to the cart.</p>
                        </div>
                        <div className="flex flex-col gap-4 sm:flex-row">
                            <div className="relative flex-grow">
                                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Search products..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-9"
                                />
                            </div>
                            <Select value={sortOrder} onValueChange={setSortOrder}>
                                <SelectTrigger className="w-full sm:w-[200px]">
                                    <SelectValue placeholder="Sort by" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="default">Default (A-Z)</SelectItem>
                                    <SelectItem value="quantity">Included / Quantity</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button onClick={handleIncludeAll} variant="outline">
                                Include All
                            </Button>
                        </div>
                        <ProductListTable products={displayedProducts} onQuantityChange={updateQuantity} />
                    </div>

                    <div className="hidden lg:block lg:w-1/3">
                        <OrderSummaryCard activeProducts={activePackageProducts} summary={summary} onCheckout={addToCheckout} />
                    </div>
                </div>
            </div>

            <MobileCheckoutBar total={summary.total} onCheckout={addToCheckout} disabled={isCheckoutDisabled} />

            <ScrollToTopButton PC />
        </HeaderLayout>
    );
}