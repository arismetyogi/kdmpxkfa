import React, { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Minus, Plus, ShoppingCart } from 'lucide-react';
import { Product, CartItem } from '@/types';
import HeaderLayout from '@/layouts/header-layout';
import { type BreadcrumbItem } from '@/types';

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
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "cart" && e.newValue) {
        setCartItems(JSON.parse(e.newValue));
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);
  
  const activePackageProducts = packageProducts.filter(p => p.assignedQuantity > 0);

  const updateQuantity = (productId: number, newQuantity: number) => {
    const quantity = isNaN(newQuantity) ? 0 : newQuantity;
    setPackageProducts(prevProducts => 
      prevProducts.map(product => 
        product.id === productId 
          ? { ...product, assignedQuantity: Math.max(0, Math.min(quantity, product.maxQuantity)) } 
          : product
      )
    );
  };

  const calculateSubtotal = (product: PackageProduct) => {
    return product.price * product.assignedQuantity;
  };

  const calculateSubtotalAll = () => {
    return activePackageProducts.reduce((total, product) => total + calculateSubtotal(product), 0);
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
      localStorage.removeItem("cart");
      const cart: CartItem[] = activePackageProducts.map(product => ({
        ...product,
        quantity: product.assignedQuantity,
        total: product.price * product.assignedQuantity
      }));
      localStorage.setItem("cart", JSON.stringify(cart));
      setCartItems(cart);
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
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Complete Health Package</h1>
                  <p className="mt-2 text-gray-600 dark:text-gray-300">
                    A comprehensive package of essential health products. 
                    Adjust quantities, or exclude items you don't need before adding to your cart.
                  </p>
              </CardContent>
            </Card>

            {/* --- MODIFIED GRID --- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {packageProducts.map((product) => {
                const isExcluded = product.assignedQuantity === 0;
                return (
                  // --- MODIFIED CARD ---
                  <Card key={product.id} className={`overflow-hidden transition-all duration-300 flex flex-col ${isExcluded ? 'opacity-60 bg-gray-50 dark:bg-zinc-800/50' : ''}`}>
                    {/* Product Image */}
                    <div className="aspect-video bg-gray-200 border-b border-dashed flex items-center justify-center">
                      {product.image ? (
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <ShoppingCart className="h-12 w-12 text-gray-400" />
                      )}
                    </div>
                    
                    {/* Card Content - uses flex-col and flex-grow for alignment */}
                    <CardContent className="p-4 flex flex-col flex-grow">
                      {/* Product Info - this part grows to push controls to the bottom */}
                      <div className="flex-grow">
                        <h3 className="text-base font-semibold text-gray-900 dark:text-white line-clamp-2">{product.name}</h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                          {currency(product.price)}
                        </p>
                      </div>
                      
                      {/* Action Controls - pushed to the bottom */}
                      <div className="mt-4">
                        {isExcluded ? (
                          <Button onClick={() => updateQuantity(product.id, product.maxQuantity)} className="w-full">
                            Include Item
                          </Button>
                        ) : (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                Qty (Max: {product.maxQuantity})
                              </span>
                              <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-md">
                                <Button
                                  variant="ghost" size="icon"
                                  onClick={() => updateQuantity(product.id, product.assignedQuantity - 1)}
                                  disabled={product.assignedQuantity <= 1}
                                  className="h-8 w-8 rounded-r-none" aria-label="Decrease quantity"
                                > <Minus className="h-4 w-4" /> </Button>
                                <input
                                  type="number"
                                  value={product.assignedQuantity}
                                  onChange={(e) => updateQuantity(product.id, parseInt(e.target.value, 10))}
                                  className="w-12 h-8 text-center bg-transparent border-x border-y-0 border-gray-300 dark:border-gray-600 focus:ring-0 focus:outline-none"
                                  min={0} max={product.maxQuantity} aria-label="Product quantity"
                                />
                                <Button
                                  variant="ghost" size="icon"
                                  onClick={() => updateQuantity(product.id, product.assignedQuantity + 1)}
                                  disabled={product.assignedQuantity >= product.maxQuantity}
                                  className="h-8 w-8 rounded-l-none" aria-label="Increase quantity"
                                > <Plus className="h-4 w-4" /> </Button>
                              </div>
                            </div>
                            <Button variant="link" size="sm" 
                              className="text-red-500 hover:text-red-600 h-auto p-0 w-full justify-start"
                              onClick={() => updateQuantity(product.id, 0)}
                            >
                              Exclude Item
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
          
          {/* Right Column - Order Summary (Unchanged) */}
          <div className="lg:w-1/3">
            <div className="sticky top-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-96 pr-4">
                    <div className="space-y-4">
                      {activePackageProducts.length > 0 ? (
                        activePackageProducts.map((product) => (
                          <div key={product.id} className="flex justify-between items-start">
                            <div>
                              <h4 className="text-sm font-medium text-gray-900 dark:text-white">{product.name}</h4>
                              <p className="text-xs text-gray-500 dark:text-gray-400">Qty: {product.assignedQuantity}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium text-gray-900 dark:text-white">{currency(calculateSubtotal(product))}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">No items included in the package.</p>
                      )}
                    </div>
                  </ScrollArea>
                  
                  <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm"><p>Subtotal</p><p>{currency(calculateSubtotalAll())}</p></div>
                      <div className="flex justify-between text-sm"><p>Tax (11%)</p><p>{currency(calculateTax())}</p></div>
                      <div className="flex justify-between text-base font-medium text-gray-900 dark:text-white pt-2 border-t border-gray-200 dark:border-gray-700"><p>Total</p><p>{currency(calculateTotalPrice())}</p></div>
                    </div>
                    
                    <Button 
                      onClick={addToCheckout}
                      disabled={activePackageProducts.length === 0}
                      className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-3 disabled:bg-gray-400 disabled:cursor-not-allowed"
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
    </HeaderLayout>
  );
}