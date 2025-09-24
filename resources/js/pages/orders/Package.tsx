<<<<<<< HEAD
import React, { useState, useEffect, useMemo } from 'react';
import { Head, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Minus, Plus, ShoppingCart, Search } from 'lucide-react';
import { Product, CartItem, BreadcrumbItem } from '@/types';
import HeaderLayout from '@/layouts/header-layout';
import PriceDisplay from '@/components/priceDisplay';
import { cn } from '@/lib/utils';

// --- Type Definitions ---
interface PackageProduct extends Product {
  assignedQuantity: number;
  maxQuantity: number;
}

interface PackagePageProps {
  products: PackageProduct[];
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'Paket Merah Putih', href: '#' },
];


// --- UPDATED: Component: Compact Product Card (No longer uses <Card>) ---
interface PackageProductCardProps {
  product: PackageProduct;
  onClick: () => void;
}

const PackageProductCard: React.FC<PackageProductCardProps> = ({ product, onClick }) => {
  const isIncluded = product.assignedQuantity > 0;
  return (
    // Replaced <Card> with a <div> and manually added the base styles
    <div
      onClick={onClick}
      className={cn(
        "rounded-lg border bg-card text-card-foreground shadow-sm", // Base styles from the <Card> component
        "overflow-hidden transition-all duration-300 cursor-pointer group relative",
        !isIncluded && 'opacity-60 hover:opacity-100'
      )}
    >
      {isIncluded && (
        <div className="absolute top-2 right-2 z-10 bg-primary text-primary-foreground rounded-full h-6 w-6 flex items-center justify-center text-xs font-bold shadow-lg">
          {product.assignedQuantity}
        </div>
      )}
      <div className="aspect-square bg-muted flex items-center justify-center overflow-hidden">
        <img 
          src={product.image || '/products/Placeholder_Medicine.png'} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={({ currentTarget }) => {
            currentTarget.src = "/products/Placeholder_Medicine.png";
          }}
        />
      </div>
      <div className="p-3"> {/* Removed bg-card as it's now on the parent */}
        <h3 className="text-sm font-semibold text-card-foreground line-clamp-2 leading-tight">{product.name}</h3>
        <p className="text-xs text-muted-foreground mt-1">Max Qty: {product.maxQuantity}</p>
      </div>
    </div>
  );
};


// --- Component: Product Editing Dialog ---
interface ProductDialogProps {
  product: PackageProduct | null;
  isOpen: boolean;
  onClose: () => void;
  onQuantityChange: (productId: number, newQuantity: number) => void;
}

const ProductDialog: React.FC<ProductDialogProps> = ({ product, isOpen, onClose, onQuantityChange }) => {
  const [quantity, setQuantity] = useState(0);

  useEffect(() => {
    if (product) {
      setQuantity(product.assignedQuantity);
    }
  }, [product]);

  if (!product) return null;

  const subtotal = product.price * quantity;

  const handleQuantityUpdate = (newQuantity: number) => {
    const validatedQuantity = Math.max(0, Math.min(newQuantity, product.maxQuantity));
    setQuantity(validatedQuantity);
  };
  
  const handleSave = () => {
    onQuantityChange(product.id, quantity);
    onClose();
  };
  
  const handleExclude = () => {
    onQuantityChange(product.id, 0);
    onClose();
  };

  const handleInclude = () => {
    handleQuantityUpdate(product.maxQuantity);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[325px]">
        <DialogHeader>
          <DialogTitle>{product.name}</DialogTitle>
          <DialogDescription>
            Atur Jumlah barang atau Exclude
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center gap-6">
             <img src={product.image || '/products/Placeholder_Medicine.png'} alt={product.name} className="w-20 h-20 object-cover rounded-md" 
                onError={({ currentTarget }) => {
                    currentTarget.src = "/products/Placeholder_Medicine.png";
                }}
             />
             <div>
                <p className="text-sm text-muted-foreground">Price per item:</p>
                <PriceDisplay price={product.price} className="text-lg font-bold" />
                <p className="text-sm text-muted-foreground mt-1">Max quantity: {product.maxQuantity}</p>
             </div>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <Button variant="outline" size="icon" onClick={() => handleQuantityUpdate(quantity - 1)} disabled={quantity <= 0}>
              <Minus className="h-4 w-4" />
            </Button>
            <Input
              id="quantity"
              type="number"
              value={quantity}
              onChange={(e) => handleQuantityUpdate(parseInt(e.target.value, 10) || 0)}
              className="w-20 text-center text-lg font-bold"
            />
            <Button variant="outline" size="icon" onClick={() => handleQuantityUpdate(quantity + 1)} disabled={quantity >= product.maxQuantity}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="mt-2 pt-3 border-t text-center">
            <p className="text-sm text-muted-foreground mb-1">Item Subtotal</p>
            <PriceDisplay price={subtotal} className="text-2xl font-bold text-primary" />
          </div>
        </div>
        <DialogFooter>
          {quantity === 0 ? (
            <Button className="w-full" onClick={handleInclude}>
              Include Item
            </Button>
          ) : (
            <>
              <Button variant="destructive" onClick={handleExclude}>Exclude Item</Button>
              <Button onClick={handleSave}>Done</Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};


// --- Main Page Component ---
export default function PackagePage({ products: initialProducts }: PackagePageProps) {
  const [packageProducts, setPackageProducts] = useState<PackageProduct[]>(initialProducts);
  const [selectedProduct, setSelectedProduct] = useState<PackageProduct | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('default');

  const activePackageProducts = packageProducts.filter(p => p.assignedQuantity > 0);

  const displayedProducts = useMemo(() => {
    let productsToDisplay = [...packageProducts];

    if (searchQuery.trim() !== '') {
      const lowercasedQuery = searchQuery.toLowerCase();
      const matched: PackageProduct[] = [];
      const rest: PackageProduct[] = [];
      
      productsToDisplay.forEach(p => {
        if (p.name.toLowerCase().includes(lowercasedQuery)) {
          matched.push(p);
        } else {
          rest.push(p);
        }
      });
      productsToDisplay = [...matched, ...rest];
    }

    switch (sortOrder) {
      case 'alphabetical':
        productsToDisplay.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'quantity':
        productsToDisplay.sort((a, b) => b.assignedQuantity - a.assignedQuantity);
        break;
      default:
        break;
    }

    return productsToDisplay;
  }, [packageProducts, searchQuery, sortOrder]);

  const updateQuantity = (productId: number, newQuantity: number) => {
    setPackageProducts(prevProducts =>
      prevProducts.map(product =>
        product.id === productId
          ? { ...product, assignedQuantity: Math.max(0, Math.min(newQuantity, product.maxQuantity)) }
          : product
      )
    );
  };

  const calculateSubtotal = (product: PackageProduct) => product.price * product.assignedQuantity;
  const calculateSubtotalAll = () => activePackageProducts.reduce((total, product) => total + calculateSubtotal(product), 0);
  const calculateTax = () => calculateSubtotalAll() * 0.11;
  const calculateTotalPrice = () => calculateSubtotalAll() + calculateTax();

  const addToCheckout = () => {
    try {
      localStorage.removeItem("cart");
      const cart: CartItem[] = activePackageProducts.map(product => ({
        ...product,
        quantity: product.assignedQuantity,
        total: product.price * product.assignedQuantity
      }));
      localStorage.setItem("cart", JSON.stringify(cart));
      router.visit(route('cart'));
    } catch (error) {
      console.error('Error adding products to cart:', error);
      alert('There was an error adding products to your cart. Please try again.');
    }
  };

  return (
    <HeaderLayout breadcrumbs={breadcrumbs}>
      <Head title="Health Package" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Package Info and Product List */}
          <div className="lg:w-2/3">
            <Card className="mb-8 w-full">
              <CardContent className="p-6">
                  <h1 className="text-3xl font-bold">Paket Koperasi Merah Putih</h1>
                  <p className="mt-2 text-muted-foreground">
                    Paket Obat Kimia Farma koperasi merah putih untuk mengisi ketubutan koperasi merah putih.
                  </p>
              </CardContent>
            </Card>

            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.g.value)}
                  className="pl-9"
                />
              </div>
              <Select value={sortOrder} onValueChange={setSortOrder}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default Order</SelectItem>
                  <SelectItem value="alphabetical">Alphabetical (A-Z)</SelectItem>
                  <SelectItem value="quantity">Quantity (High to Low)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {displayedProducts.map((product) => (
                <PackageProductCard 
                  key={product.id} 
                  product={product} 
                  onClick={() => setSelectedProduct(product)} 
                />
              ))}
            </div>
          </div>
          
          {/* Right Column - Order Summary */}
          <div className="lg:w-1/3">
            <div className="sticky top-8">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                  <ScrollArea className="h-96 pr-4">
                    <div className="space-y-4">
                      {activePackageProducts.length > 0 ? (
                        activePackageProducts.map((product) => (
                          <div key={product.id} className="flex justify-between items-start">
                            <div>
                              <h4 className="text-sm font-medium">{product.name}</h4>
                              <p className="text-xs text-muted-foreground">Qty: {product.assignedQuantity}</p>
                            </div>
                            <div className="text-right">
                              <PriceDisplay price={calculateSubtotal(product)} className="text-sm font-medium" />
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
                      <div className="flex justify-between text-sm"><p>Subtotal</p><PriceDisplay price={calculateSubtotalAll()} /></div>
                      <div className="flex justify-between text-sm"><p>Tax (11%)</p><PriceDisplay price={calculateTax()} /></div>
                      <div className="flex justify-between text-base font-medium pt-2 border-t mt-2"><p>Total</p><PriceDisplay price={calculateTotalPrice()} /></div>
                    </div>
                    
                    <Button 
                      onClick={addToCheckout}
                      disabled={activePackageProducts.length === 0}
                      className="w-full mt-6 py-3"
                      size="lg"
                    >
                      <ShoppingCart className="mr-2 h-5 w-5" />
                      Add to Checkout
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <ProductDialog 
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onQuantityChange={updateQuantity}
      />
    </HeaderLayout>
  );
}
=======
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import HeaderLayout from '@/layouts/header-layout';
import { CartItem, Product, type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Minus, Plus, ShoppingCart } from 'lucide-react';
import { useEffect, useState } from 'react';

interface PackageProduct extends Product {
    assignedQuantity: number;
    maxQuantity: number;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Packages', href: '/packages' },
    { title: 'Health Package', href: '#' },
];

interface PackagePageProps {
    products: PackageProduct[];
}

export default function PackagePage({ products: initialProducts }: PackagePageProps) {
    const [packageProducts, setPackageProducts] = useState<PackageProduct[]>(initialProducts);
    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    useEffect(() => {
        const storedCart = localStorage.getItem('cart');
        if (storedCart) {
            setCartItems(JSON.parse(storedCart));
        }

        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'cart' && e.newValue) {
                setCartItems(JSON.parse(e.newValue));
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const updateQuantity = (productId: number, newQuantity: number) => {
        setPackageProducts((prevProducts) =>
            prevProducts.map((product) =>
                product.id === productId ? { ...product, assignedQuantity: Math.max(1, Math.min(newQuantity, product.maxQuantity)) } : product,
            ),
        );
    };

    const calculateSubtotal = (product: PackageProduct) => {
        return product.price * product.assignedQuantity;
    };

    const calculateSubtotalAll = () => {
        return packageProducts.reduce((total, product) => {
            return total + product.price * product.assignedQuantity;
        }, 0);
    };

    const calculateTax = () => {
        return calculateSubtotalAll() * 0.11;
    };

    const calculateTotalPrice = () => {
        return calculateSubtotalAll() + calculateTax();
    };

    const currency = (value: number | undefined) => {
        if (value === undefined) return 'Rp 0';
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        }).format(value);
    };

    const addToCheckout = () => {
        try {
            // Clear existing cart items in localStorage
            localStorage.removeItem('cart');

            // Create new cart with only package products
            const cart: CartItem[] = [];

            // Add all package products to cart
            packageProducts.forEach((product) => {
                const newItem: CartItem = {
                    ...product,
                    quantity: product.assignedQuantity,
                    total: product.price * product.assignedQuantity,
                };

                // Add new item to cart
                cart.push(newItem);
            });

            // Update localStorage
            localStorage.setItem('cart', JSON.stringify(cart));

            // Update state to trigger UI refresh
            setCartItems(cart);

            // Redirect to cart page
            router.visit(route('cart'));
        } catch (error) {
            console.error('Error adding products to cart:', error);
            alert('There was an error adding products to your cart. Please try again.');
        }
    };

    return (
        <HeaderLayout breadcrumbs={breadcrumbs}>
            <Head title="Health Package" />

            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="flex flex-col gap-8 lg:flex-row">
                    {/* Left Column - Package Info and Product List */}
                    <div className="lg:w-2/3">
                        {/* Package Info Card - Full Width */}
                        <Card className="mb-8 w-full">
                            <CardContent className="p-6">
                                <div className="mb-4">
                                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Complete Health Package</h1>
                                    <p className="mt-2 text-gray-600 dark:text-gray-300">
                                        A comprehensive package of essential health products for your family. This package includes vitamins,
                                        supplements, and common medications. You can adjust the quantity of each product between 1 and the maximum
                                        limit.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="grid grid-cols-1 gap-6">
                            {packageProducts.map((product) => (
                                <Card key={product.id} className="overflow-hidden">
                                    <CardContent className="p-6">
                                        <div className="flex flex-col gap-6 sm:flex-row">
                                            {/* Product Image */}
                                            <div className="flex-shrink-0">
                                                <div className="flex h-24 w-24 items-center justify-center rounded-xl border-2 border-dashed bg-gray-200">
                                                    {product.image ? (
                                                        <img
                                                            src={product.image}
                                                            alt={product.name}
                                                            className="h-full w-full rounded-md object-cover"
                                                        />
                                                    ) : (
                                                        <ShoppingCart className="h-8 w-8 text-gray-400" />
                                                    )}
                                                </div>
                                            </div>

                                            {/* Product Details */}
                                            <div className="flex-grow">
                                                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                                                    <div>
                                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{product.name}</h3>
                                                        <p className="mt-1 line-clamp-2 text-sm text-gray-500 dark:text-gray-400">
                                                            {product.description}
                                                        </p>
                                                        <p className="mt-2 text-lg font-medium text-blue-600 dark:text-blue-400">
                                                            {currency(product.price)}
                                                        </p>
                                                    </div>

                                                    {/* Quantity Controls */}
                                                    <div className="mt-4 flex items-center sm:mt-0">
                                                        <div className="flex items-center rounded-md border border-gray-300">
                                                            <button
                                                                onClick={() => updateQuantity(product.id, product.assignedQuantity - 1)}
                                                                disabled={product.assignedQuantity <= 1}
                                                                className={`p-2 ${
                                                                    product.assignedQuantity <= 1
                                                                        ? 'cursor-not-allowed text-gray-300'
                                                                        : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
                                                                }`}
                                                                aria-label="Decrease quantity"
                                                            >
                                                                <Minus className="h-4 w-4" />
                                                            </button>

                                                            <span className="px-3 py-2 text-sm font-medium">{product.assignedQuantity}</span>

                                                            <button
                                                                onClick={() => updateQuantity(product.id, product.assignedQuantity + 1)}
                                                                disabled={product.assignedQuantity >= product.maxQuantity}
                                                                className={`p-2 ${
                                                                    product.assignedQuantity >= product.maxQuantity
                                                                        ? 'cursor-not-allowed text-gray-300'
                                                                        : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
                                                                }`}
                                                                aria-label="Increase quantity"
                                                            >
                                                                <Plus className="h-4 w-4" />
                                                            </button>
                                                        </div>

                                                        <span className="ml-3 text-sm text-gray-500 dark:text-gray-400">
                                                            Max: {product.maxQuantity}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="mt-4 flex items-center justify-between">
                                                    <div className="text-sm">
                                                        <span className="text-gray-500 dark:text-gray-400">Subtotal: </span>
                                                        <span className="font-medium text-gray-900 dark:text-white">
                                                            {currency(calculateSubtotal(product))}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* Right Column - Order Summary */}
                    <div className="lg:w-1/3">
                        <div className="sticky top-8">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-xl">Order Summary</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ScrollArea className="h-96 pr-4">
                                        <div className="space-y-4">
                                            {packageProducts.map((product) => (
                                                <div key={product.id} className="flex items-start justify-between">
                                                    <div>
                                                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">{product.name}</h4>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">Qty: {product.assignedQuantity}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                            {currency(calculateSubtotal(product))}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </ScrollArea>

                                    <div className="mt-6 border-t border-gray-200 pt-4 dark:border-gray-700">
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <p>Subtotal</p>
                                                <p>{currency(calculateSubtotalAll())}</p>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <p>Tax (11%)</p>
                                                <p>{currency(calculateTax())}</p>
                                            </div>
                                            <div className="flex justify-between border-t border-gray-200 pt-2 text-base font-medium text-gray-900 dark:border-gray-700 dark:text-white">
                                                <p>Total</p>
                                                <p>{currency(calculateTotalPrice())}</p>
                                            </div>
                                        </div>

                                        <Button onClick={addToCheckout} className="mt-6 w-full bg-blue-600 py-3 text-white hover:bg-blue-700">
                                            <ShoppingCart className="mr-2 h-5 w-5" />
                                            Add to Checkout
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </HeaderLayout>
    );
}
>>>>>>> KDMP/master
