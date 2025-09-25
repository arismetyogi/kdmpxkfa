import React, { useState, useMemo, useCallback } from 'react';
import { Head, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Minus, Plus, ShoppingCart, Search } from 'lucide-react';
import { Product, CartItem, BreadcrumbItem } from '@/types';
import HeaderLayout from '@/layouts/header-layout';
import PriceDisplay from '@/components/priceDisplay';
import { cn } from '@/lib/utils';
// Note: react-aria-components is not needed if we build the component manually
// import { Group } from "react-aria-components" 

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

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'Paket Merah Putih', href: '#' },
];

// --- Sub-component: Quantity Input ---
interface QuantityInputProps {
  value: number;
  onChange: (newValue: number) => void;
  min?: number;
  max?: number;
  decrementDisabled?: boolean;
  incrementDisabled?: boolean;
}

const QuantityInput: React.FC<QuantityInputProps> = ({ value, onChange, min, max, decrementDisabled, incrementDisabled }) => (
  <div className="relative flex items-center max-w-[120px]">
    <Button
      type="button"
      size="icon"
      variant="outline"
      onClick={() => onChange(value - 1)}
      disabled={decrementDisabled}
      className="h-9 w-9 rounded-r-none"
    >
      <Minus className="h-4 w-4" />
    </Button>
    <Input
      className="h-9 w-12 text-center rounded-none focus-visible:ring-0"
      value={value}
      onChange={(e) => onChange(parseInt(e.target.value, 10) || 0)}
      min={min}
      max={max}
    />
    <Button
      type="button"
      size="icon"
      variant="outline"
      onClick={() => onChange(value + 1)}
      disabled={incrementDisabled}
      className="h-9 w-9 rounded-l-none"
    >
      <Plus className="h-4 w-4" />
    </Button>
  </div>
);


// --- Sub-component: Product Table Row ---
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

  const handleExclude = () => onQuantityChange(product.id, 0);
  const handleInclude = () => onQuantityChange(product.id, product.maxQuantity);

  const assignedBoxQuantity = product.assignedQuantity / product.content;
  const maxBoxQuantity = product.maxQuantity / product.content;
  const pricePerBox = product.price * product.content;

  return (
    <TableRow className={cn("transition-all", isExcluded && "opacity-60 bg-muted/50")}>
      <TableCell>
        <img
          src={product.image || '/products/Placeholder_Medicine.png'}
          alt={product.name}
          className="w-16 h-16 object-cover rounded-md border"
          onError={({ currentTarget }) => { currentTarget.src = "/products/Placeholder_Medicine.png"; }}
        />
      </TableCell>
      <TableCell className="font-medium">
        <p className="line-clamp-2">{product.name}</p>
        <p className="text-xs text-muted-foreground">{product.order_unit}</p>
      </TableCell>
      <TableCell><PriceDisplay price={pricePerBox} /></TableCell>
      <TableCell className="text-center">{maxBoxQuantity}</TableCell>
      <TableCell>
        <div className="flex justify-center">
            <QuantityInput
                value={assignedBoxQuantity}
                onChange={handleBoxQuantityUpdate}
                min={0}
                max={maxBoxQuantity}
                decrementDisabled={product.assignedQuantity <= 0}
                incrementDisabled={product.assignedQuantity >= product.maxQuantity}
            />
        </div>
      </TableCell>
      <TableCell className="text-right font-medium"><PriceDisplay price={product.price * product.assignedQuantity} /></TableCell>
      <TableCell className="text-center">
        {isExcluded ? (
          <Button variant="secondary" size="sm" onClick={handleInclude} className="whitespace-nowrap">Include</Button>
        ) : (
          <Button variant="destructive" size="sm" onClick={handleExclude}>Exclude</Button>
        )}
      </TableCell>
    </TableRow>
  );
});

// --- Sub-component: Product List Table ---
interface ProductListTableProps {
    products: PackageProduct[];
    onQuantityChange: (productId: number, newQuantity: number) => void;
}

const ProductListTable: React.FC<ProductListTableProps> = ({ products, onQuantityChange }) => (
    <Card>
        <Table className="table-fixed w-full">
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[80px]">Image</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead className="w-[120px]">Price</TableHead>
                    <TableHead className="text-center w-[60px]">Max</TableHead>
                    <TableHead className="text-center w-[140px]">Order Qty</TableHead>
                    <TableHead className="text-right w-[120px]">Subtotal</TableHead>
                    <TableHead className="text-center w-[110px]">Action</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {products.length > 0 ? (
                    products.map((product) => (
                        <ProductTableRow key={product.id} product={product} onQuantityChange={onQuantityChange} />
                    ))
                ) : (
                    <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">No products found.</TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    </Card>
);

// --- Sub-component: Order Summary Card ---
interface OrderSummaryCardProps {
    activeProducts: PackageProduct[];
    summary: { subtotal: number; tax: number; total: number; };
    onCheckout: () => void;
}

const OrderSummaryCard: React.FC<OrderSummaryCardProps> = ({ activeProducts, summary, onCheckout }) => (
    <div className="sticky top-8">
        <Card>
            <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                <ScrollArea className="h-96 pr-4 -mr-4">
                    <div className="space-y-4">
                        {activeProducts.length > 0 ? (
                            activeProducts.map((product) => (
                                <div key={product.id} className="flex justify-between items-start">
                                    <div>
                                        <h4 className="text-sm font-medium line-clamp-2">{product.name}</h4>
                                        <p className="text-xs text-muted-foreground">
                                            Qty: {product.assignedQuantity / product.content} {product.order_unit}
                                        </p>
                                    </div>
                                    <div className="text-right shrink-0 pl-4">
                                        <PriceDisplay price={product.price * product.assignedQuantity} className="text-sm font-medium" />
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-muted-foreground text-center py-4">No items included in the package.</p>
                        )}
                    </div>
                </ScrollArea>
                <div className="mt-6 pt-4 border-t">
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm"><p>Subtotal</p><PriceDisplay price={summary.subtotal} /></div>
                        <div className="flex justify-between text-sm"><p>Tax (11%)</p><PriceDisplay price={summary.tax} /></div>
                        <div className="flex justify-between text-base font-bold pt-2 border-t mt-2"><p>Total</p><PriceDisplay price={summary.total} /></div>
                    </div>
                    <Button onClick={onCheckout} disabled={activeProducts.length === 0} className="w-full mt-6" size="lg">
                        <ShoppingCart className="mr-2 h-5 w-5" />
                        Add to Checkout
                    </Button>
                </div>
            </CardContent>
        </Card>
    </div>
);


// --- Main Page Component ---
export default function PackagePage({ products: initialProducts }: PackagePageProps) {
  const [packageProducts, setPackageProducts] = useState<PackageProduct[]>(initialProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('default');

  // OPTIMIZATION: Memoize update function to prevent re-creation, helps React.memo work effectively.
  const updateQuantity = useCallback((productId: number, newQuantity: number) => {
    setPackageProducts(prev =>
      prev.map(p =>
        p.id === productId
          ? { ...p, assignedQuantity: Math.max(0, Math.min(newQuantity, p.maxQuantity)) }
          : p
      )
    );
  }, []);

  const handleIncludeAll = () => {
    setPackageProducts(prev => prev.map(p => ({ ...p, assignedQuantity: p.maxQuantity })));
  };

  // OPTIMIZATION: Memoize derived state to avoid re-calculating on every render.
  const activePackageProducts = useMemo(() => 
    packageProducts.filter(p => p.assignedQuantity > 0), 
    [packageProducts]
  );
  
  const displayedProducts = useMemo(() => {
    let products = [...packageProducts];
    if (searchQuery.trim() !== '') {
      products = products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    switch (sortOrder) {
      case 'alphabetical': return products.sort((a, b) => a.name.localeCompare(b.name));
      case 'quantity': return products.sort((a, b) => {
          if (a.assignedQuantity > 0 && b.assignedQuantity === 0) return -1;
          if (a.assignedQuantity === 0 && b.assignedQuantity > 0) return 1;
          return b.assignedQuantity - a.assignedQuantity;
        });
      default: return products;
    }
  }, [packageProducts, searchQuery, sortOrder]);

  // OPTIMIZATION: Memoize summary calculations.
  const summary = useMemo(() => {
    const subtotal = activePackageProducts.reduce((total, p) => total + (p.price * p.assignedQuantity), 0);
    const tax = subtotal * 0.11;
    const total = subtotal + tax;
    return { subtotal, tax, total };
  }, [activePackageProducts]);

  const addToCheckout = () => {
    try {
      const cart: CartItem[] = activePackageProducts.map(p => ({
        ...p,
        // Use price per order unit (price * content) instead of base price
        price: 1,
        quantity: p.assignedQuantity / p.content,
        total: (p.price) * p.assignedQuantity
      }));
      localStorage.setItem("cart", JSON.stringify(cart)); // Overwrites any existing cart
      router.visit(route('cart'));
    } catch (error) {
      console.error('Error adding products to cart:', error);
      alert('There was an error creating your cart. Please try again.');
    }
  };

  return (
    <HeaderLayout breadcrumbs={breadcrumbs}>
      <Head title="Health Package" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* --- Left Column: Package & Product List --- */}
          <div className="lg:w-2/3 flex flex-col gap-6">
            <div>
              <h1 className="text-3xl font-bold">Paket Koperasi Merah Putih</h1>
              <p className="mt-2 text-muted-foreground">
                Manage item quantities below. Excluded items won't be added to the cart.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search products..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-9" />
              </div>
              <Select value={sortOrder} onValueChange={setSortOrder}>
                <SelectTrigger className="w-full sm:w-[200px]"><SelectValue placeholder="Sort by" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default Order</SelectItem>
                  <SelectItem value="alphabetical">Alphabetical (A-Z)</SelectItem>
                  <SelectItem value="quantity">Included / Quantity</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleIncludeAll} variant="outline">Include All</Button>
            </div>
            <ProductListTable products={displayedProducts} onQuantityChange={updateQuantity} />
          </div>
          
          {/* --- Right Column: Order Summary --- */}
          <div className="lg:w-1/3">
            <OrderSummaryCard activeProducts={activePackageProducts} summary={summary} onCheckout={addToCheckout} />
          </div>
        </div>
      </div>
    </HeaderLayout>
  );
}