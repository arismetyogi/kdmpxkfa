import PriceDisplay from '@/components/priceDisplay';
import QuantityInput from '@/components/QuantityInput';
import ScrollToTopButton from '@/components/ScrollToTop';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import HeaderLayout from '@/layouts/header-layout';
import { cn } from '@/lib/utils';
import { BreadcrumbItem, CartItemOrPackage, PackageItem, Product } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Search, ShoppingCart } from 'lucide-react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

// --- Type Definitions ---
interface PackageProduct extends Product {
    assignedQuantity: number;
    initQuantity: number; // MODIFICATION: Renamed from maxQuantity
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
    }, [value, delay]);

    return debouncedValue;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Paket Merah Putih', href: '#' },
];

// --- Sub-component: Product Table Row (Updated for Mobile) ---
interface ProductTableRowProps {
    product: PackageProduct;
    onQuantityChange: (productId: number, newQuantity: number) => void;
}

const ProductTableRow: React.FC<ProductTableRowProps> = React.memo(({ product, onQuantityChange }) => {
    const isExcluded = product.assignedQuantity === 0;

    // Ensure content is at least 1 to prevent division by zero
    const safeContent = Math.max(1, product.content || 1);

    const handleBoxQuantityUpdate = (newBoxQuantity: number) => {
        const rawQuantity = newBoxQuantity * safeContent;
        // MODIFICATION: Removed maxQuantity limit
        const validatedQuantity = Math.max(0, rawQuantity);
        const finalQuantity = Math.floor(validatedQuantity / safeContent) * safeContent;
        onQuantityChange(product.id, finalQuantity);
    };

    const handleMobileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newBoxQuantity = parseInt(e.target.value, 10) || 0;
        handleBoxQuantityUpdate(newBoxQuantity);
    };

    const handleExclude = () => onQuantityChange(product.id, 0);
    // MODIFICATION: Uses initQuantity instead of maxQuantity
    const handleInclude = () => onQuantityChange(product.id, product.initQuantity);

    const assignedBoxQuantity = product.assignedQuantity / safeContent;
    const pricePerBox = product.price * safeContent;

    return (
        <TableRow className={cn('transition-all', isExcluded && 'bg-muted/50')}>
            <TableCell className={cn('hidden p-2 xl:table-cell', isExcluded && 'opacity-60')}>
                <img
                    src={product.image ? product.image[0] : '/products/Placeholder_Medicine.png'}
                    alt={product.name}
                    className="h-16 w-16 rounded-md border object-cover"
                    onError={({ currentTarget }) => {
                        currentTarget.src = '/products/Placeholder_Medicine.png';
                    }}
                />
            </TableCell>
            <TableCell className={cn('px-2 py-2 font-medium sm:px-4', isExcluded && 'opacity-60')}>
                <p className="line-clamp-2 text-xs font-medium sm:text-base">{product.name}</p>

                <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground sm:hidden">
                    <PriceDisplay price={pricePerBox} currency="" decimal="hidden" />
                    <span>/ {product.order_unit}</span>
                </div>

                <p className="hidden text-xs text-muted-foreground sm:block">{product.order_unit}</p>
            </TableCell>
            <TableCell className={cn('hidden px-2 text-center sm:table-cell sm:text-xs lg:text-sm xl:text-base', isExcluded && 'opacity-60')}>
                <PriceDisplay price={pricePerBox} className="text-sm" />
            </TableCell>
            {/* REMOVED: Max quantity column is no longer displayed */}
            <TableCell className={cn('p-2', isExcluded && 'opacity-60')}>
                <div className="flex justify-center">
                    <div className="hidden lg:flex">
                        <QuantityInput
                            value={assignedBoxQuantity}
                            onChange={handleBoxQuantityUpdate}
                            decrementDisabled={product.assignedQuantity <= 0}
                            // MODIFICATION: Removed incrementDisabled as there's no max limit
                        />
                    </div>
                    <div className="lg:hidden">
                        <Input
                            className="h-9 w-12 text-center focus-visible:ring-0"
                            value={assignedBoxQuantity}
                            onChange={handleMobileInputChange}
                            min={0}
                            // MODIFICATION: Removed max attribute
                        />
                    </div>
                </div>
            </TableCell>
            <TableCell className={cn('px-2 text-left font-medium', isExcluded && 'opacity-60')}>
                <PriceDisplay price={product.price * product.assignedQuantity} className="sm:text-xs lg:text-sm xl:hidden" />
                <PriceDisplay price={product.price * product.assignedQuantity} className="hidden xl:block" />
            </TableCell>
            <TableCell className="px-2 text-center">
                {isExcluded ? (
                    <Button variant="default" size="sm" onClick={handleInclude} className="px-2">
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
    <Table className="w-full table-fixed border">
        <TableHeader>
            <TableRow>
                <TableHead className="hidden w-[80px] p-2 xl:table-cell">Image</TableHead>
                <TableHead className="px-2 sm:px-4">Product Name</TableHead>
                <TableHead className="hidden w-[100px] px-2 text-center sm:table-cell">Price</TableHead>
                {/* REMOVED: Max quantity header */}
                <TableHead className="w-[65px] px-2 text-center lg:w-[150px]">Qty</TableHead>
                <TableHead className="w-[100px] px-2 text-center">Subtotal</TableHead>
                <TableHead className="w-[80px] px-2 text-center">Action</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {products.length > 0 ? (
                products.map((product) => <ProductTableRow key={product.id} product={product} onQuantityChange={onQuantityChange} />)
            ) : (
                <TableRow>
                    {/* MODIFICATION: colSpan updated from 7 to 6 */}
                    <TableCell colSpan={6} className="h-24 text-center">
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
    onCart: () => void;
}

const OrderSummaryCard: React.FC<OrderSummaryCardProps> = ({ activeProducts, summary, onCart }) => (
    <div className="sticky top-24">
        <Card>
            <CardContent className="px-6">
                <h2 className="mb-4 text-xl font-bold">Order Summary</h2>
                <ScrollArea className="-mr-4 h-50 pr-4 xl:h-64">
                    <div className="space-y-4">
                        {activeProducts.length > 0 ? (
                            activeProducts.map((product) => (
                                <div key={product.id} className="flex items-start justify-between">
                                    <div>
                                        <h4 className="line-clamp-2 text-sm font-medium">{product.name}</h4>
                                        <p className="text-xs text-muted-foreground">
                                            Qty: {product.assignedQuantity / Math.max(1, product.content || 1)} {product.order_unit}
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
                    <Button onClick={onCart} disabled={activeProducts.length === 0} className="mt-6 w-full" size="lg">
                        <ShoppingCart className="mr-2 h-5 w-5" />
                        Proceed to Cart
                    </Button>
                </div>
            </CardContent>
        </Card>
    </div>
);

// --- Mobile Cart Bar ---
interface MobileCartBarProps {
    total: number;
    onCart: () => void;
    disabled: boolean;
}

const MobileCartBar: React.FC<MobileCartBarProps> = ({ total, onCart, disabled }) => (
    <div className="fixed right-0 bottom-0 left-0 z-10 border-t bg-background shadow-lg lg:hidden">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 px-4 pt-3 pb-4 sm:px-6">
            <div className="flex flex-col items-center">
                <p className="text-sm text-muted-foreground">Total Price</p>
                <PriceDisplay price={total} className="text-2xl font-bold text-primary" />
            </div>
            <Button onClick={onCart} disabled={disabled} size="lg" className="w-full max-w-sm">
                <ShoppingCart className="mr-2 h-5 w-5" />
                Proceed to Cart
            </Button>
        </div>
    </div>
);

// --- Main Page Component ---
export default function PackagePage({ products: initialProducts }: PackagePageProps) {
    const [packageProducts, setPackageProducts] = useState<PackageProduct[]>(initialProducts);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortOrder, setSortOrder] = useState('default');
    const [editingPackageId, setEditingPackageId] = useState<string | null>(null);
    const debouncedSearchQuery = useDebounce(searchQuery, 500);

    useEffect(() => {
        const editingPackage = localStorage.getItem('editingPackage');
        if (editingPackage) {
            const packageItem = JSON.parse(editingPackage);
            setEditingPackageId(packageItem.id);

            setPackageProducts((prev) =>
                prev.map((product) => {
                    const packageContent = packageItem.packageContents.find((content: any) => content.product_id === product.id);

                    if (packageContent) {
                        return {
                            ...product,
                            // MODIFICATION: Removed maxQuantity limit when restoring from cart
                            assignedQuantity: Math.max(0, packageContent.quantity * (product.content || 1)),
                        };
                    } else {
                        return {
                            ...product,
                            assignedQuantity: 0,
                        };
                    }
                }),
            );

            localStorage.removeItem('editingPackage');
        }
    }, []);

    const updateQuantity = useCallback((productId: number, newQuantity: number) => {
        setPackageProducts((prev) =>
            // MODIFICATION: Removed maxQuantity limit
            prev.map((p) => (p.id === productId ? { ...p, assignedQuantity: Math.max(0, newQuantity) } : p)),
        );
    }, []);

    const handleIncludeAll = () => {
        // MODIFICATION: Uses initQuantity instead of maxQuantity
        setPackageProducts((prev) => prev.map((p) => ({ ...p, assignedQuantity: p.initQuantity })));
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
                    // Calculate the displayed quantity using the same formula used in the UI
                    const aDisplayedQuantity = a.assignedQuantity / Math.max(1, a.content || 1);
                    const bDisplayedQuantity = b.assignedQuantity / Math.max(1, b.content || 1);

                    // First, prioritize items that are included (displayedQuantity > 0) over excluded items (displayedQuantity === 0)
                    const aIsIncluded = aDisplayedQuantity > 0 ? 1 : 0;
                    const bIsIncluded = bDisplayedQuantity > 0 ? 1 : 0;

                    if (aIsIncluded !== bIsIncluded) {
                        return bIsIncluded - aIsIncluded; // Included items first
                    }

                    // If both are included or both are excluded, sort by displayed quantity in descending order
                    return bDisplayedQuantity - aDisplayedQuantity;
                });
            case 'subtotal-high':
                return products.sort((a, b) => {
                    // Sort by subtotal (price * assignedQuantity) in descending order
                    const aSubtotal = a.price * a.assignedQuantity;
                    const bSubtotal = b.price * b.assignedQuantity;
                    return bSubtotal - aSubtotal;
                });
            case 'subtotal-low':
                return products.sort((a, b) => {
                    // Sort by subtotal (price * assignedQuantity) in ascending order
                    const aSubtotal = a.price * a.assignedQuantity;
                    const bSubtotal = b.price * b.assignedQuantity;
                    return aSubtotal - bSubtotal;
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

    const addToCart = () => {
        try {
            const packageTotalPrice = activePackageProducts.reduce((total, p) => total + p.price * p.assignedQuantity, 0);
            const packageItem: PackageItem = {
                id: editingPackageId || 'merah-putih-package-' + Date.now(),
                name: 'Paket Merah Putih',
                slug: 'paket-merah-putih',
                price: packageTotalPrice,
                image: '/products/package-icon.png',
                order_unit: 'package',
                content: 1,
                base_uom: 'package',
                weight: 0,
                isPackage: true,
                packageContents: activePackageProducts.map((p) => ({
                    product_id: p.id,
                    name: p.name,
                    quantity: p.assignedQuantity / Math.max(1, p.content || 1),
                    price: p.price,
                    image: p.image,
                    order_unit: p.order_unit,
                    content: p.content,
                    base_uom: p.base_uom || 'unit',
                    weight: p.weight || 0,
                })),
            };

            const existingCart = localStorage.getItem('cart');
            let finalCart: CartItemOrPackage[] = [];

            if (existingCart) {
                const parsedExistingCart: CartItemOrPackage[] = JSON.parse(existingCart);
                if (editingPackageId) {
                    finalCart = parsedExistingCart.map((item) => {
                        if ('isPackage' in item && 'id' in item && item.id === editingPackageId) {
                            return packageItem;
                        }
                        return item;
                    });
                    const packageExists = finalCart.some((item) => 'isPackage' in item && 'id' in item && item.id === editingPackageId);
                    if (!packageExists) {
                        finalCart = [...parsedExistingCart, packageItem];
                    }
                } else {
                    finalCart = [...parsedExistingCart, packageItem];
                }
            } else {
                finalCart = [packageItem];
            }

            localStorage.setItem('cart', JSON.stringify(finalCart));
            setEditingPackageId(null);
            router.visit(route('cart'));
        } catch (error) {
            console.error('Error adding package to Cart:', error);
            alert('There was an error creating your Cart. Please try again.');
        }
    };

    const isCartDisabled = activePackageProducts.length === 0;

    return (
        <HeaderLayout breadcrumbs={breadcrumbs}>
            <Head title="Paket Merah Putih" />
            <div className="py- 8 mx-auto max-w-7xl px-4 pb-32 sm:px-6 xl:px-8 xl:pb-8">
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
                                    <SelectItem value="subtotal-high">Highest Subtotal</SelectItem>
                                    <SelectItem value="subtotal-low">Lowest Subtotal</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button onClick={handleIncludeAll} variant="outline">
                                Include All
                            </Button>
                        </div>
                        <ProductListTable products={displayedProducts} onQuantityChange={updateQuantity} />
                    </div>

                    <div className="hidden lg:block lg:w-1/3">
                        <OrderSummaryCard activeProducts={activePackageProducts} summary={summary} onCart={addToCart} />
                    </div>
                </div>
            </div>

            <MobileCartBar total={summary.total} onCart={addToCart} disabled={isCartDisabled} />

            <ScrollToTopButton PC />
        </HeaderLayout>
    );
}
