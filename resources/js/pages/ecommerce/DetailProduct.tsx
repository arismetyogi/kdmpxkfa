import HeaderLayout from '@/layouts/header-layout';
import { Product, CartItem, type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import FloatingCart from '@/components/FloatingCart';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ShoppingCart, Minus, Plus, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import ProductCard from "@/components/product-card";
import { Lens } from "@/components/ui/lens";
import Autoplay from "embla-carousel-autoplay"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

const MotionButton = motion(Button);

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: route('dashboard') },
  { title: 'Products', href: route('orders.products') },
  { title: 'Product Detail', href: '#' },
];

export default function DetailProduct({ product, relatedProducts }: { product: Product; relatedProducts: Product[] }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const totalItems = cart.length;
  const [animationTrigger, setAnimationTrigger] = useState(0);
  

  // Load cart from localStorage
  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  // Reset button state and hide tooltip after a delay
  useEffect(() => {
    if (!isAdded) return;
    const timer = setTimeout(() => {
      setIsAdded(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, [isAdded]);

  const addToCart = (productToAdd: Product, quantityToAdd: number) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === productToAdd.id);
      let newCart;
      if (existingItem) {
        newCart = prevCart.map((item) =>
          item.id === productToAdd.id
            ? { ...item, quantity: item.quantity + quantityToAdd }
            : item,
        );
      } else {
        const newCartItem: Omit<CartItem, 'total'> = { ...productToAdd, quantity: quantityToAdd };
        newCart = [...prevCart, newCartItem as CartItem];
      }
      localStorage.setItem('cart', JSON.stringify(newCart));
      return newCart;
    });
    setAnimationTrigger(prev => prev + 1);
  };

  const handleQuantityChange = (amount: number) => {
    setQuantity((prev) => Math.max(1, prev + amount));
  };

  const handleAddToCartClick = () => {
    if (isAdded) return;
    addToCart(product, quantity);
    setIsAdded(true);
  };
  console.log(product.category?.main_category);

  return (
    <HeaderLayout breadcrumbs={breadcrumbs}>
      <Head title={product.name} />

      <div className="py-6 md:py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">

          {/* Grid 3 kolom */}
          <div className="grid p-6 lg:p-0 grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 lg:gap-14">
            
          {/* Kolom 1: Gambar Produk dengan Lens */}
          <div className="lg:col-span-4">
            <Lens>
              <img
                src={product.image || '/placeholder.jpg'}
                alt={product.name}
                className="w-full h-auto object-cover rounded-lg aspect-square border-1"
              />
            </Lens>
          </div>

            {/* Kolom 2: Informasi Produk */}
            <div className="flex flex-col lg:col-span-5">
              <div className="flex justify-between items-start gap-4">
                <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight">{product.name}</h1>
                {product.category?.main_category && (
                  <Badge variant="secondary" className="shrink-0 mt-1">
                    {product.category.main_category}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-1">{product.weight} gram / {product.base_uom}</p>
              <div className="mt-4 space-y-2">
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl lg:text-4xl font-bold text-primary">Rp {product.price.toLocaleString('id-ID')}</p>
                  <span className="text-sm text-muted-foreground">/ {product.order_unit}</span>
                </div>
                <div className='flex items-center gap-4'>
                  <p className="text-sm text-muted-foreground">{product.content} {product.base_uom} / {product.order_unit}</p>
                  {product.is_active ? (
                    <Badge className="border-transparent bg-green-100 text-green-800 dark:bg-green-900/70 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900">Tersedia</Badge>
                  ) : (
                    <Badge variant="destructive">Habis</Badge>
                  )}
                </div>
              </div>

              {/* Accordion Deskripsi & Info Lain */}
              <div className="mt-8 border-t border-border">
                <Accordion type="single" collapsible className="w-full pt-2" defaultValue="description">
                  <AccordionItem value="description">
                    <AccordionTrigger>Deskripsi</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-sm leading-relaxed">
                        {product.description || 'Tidak ada deskripsi untuk produk ini.'}
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Pharmacology Information */}
                  <AccordionItem value="pharmacology">
                    <AccordionTrigger>Farmakologi</AccordionTrigger>
                    <AccordionContent>
                      {(() => {
                        let pharmacologyData: string[] = [];
                        if (typeof product.pharmacology === "string" && product.pharmacology.startsWith("[")) {
                          pharmacologyData = JSON.parse(product.pharmacology);
                        }
                        if (pharmacologyData.length > 0) {
                          return (
                            <ul className="list-disc pl-5 space-y-1 text-sm ">
                              {pharmacologyData.map((item, index) => (
                                <li key={index}>{item}</li>
                              ))}
                            </ul>
                          );
                        }
                        return (
                          <p className="text-sm ">
                            {typeof product.pharmacology === "string"
                              ? product.pharmacology
                              : "Tidak ada informasi farmakologi untuk produk ini."}
                          </p>
                        );
                      })()}
                    </AccordionContent>
                  </AccordionItem>

                  {/* Dosage Information */}
                  <AccordionItem value="dosage">
                    <AccordionTrigger>Aturan Pakai & Dosis</AccordionTrigger>
                    <AccordionContent>
                      {(() => {
                        let dosageData: Record<string, string> = {};
                        if (typeof product.dosage === "string" && product.dosage.startsWith("{")) {
                          dosageData = JSON.parse(product.dosage);
                        }
                        const dosageEntries = Object.entries(dosageData);
                        if (dosageEntries.length > 0) {
                          return (
                            <ul className="list-disc pl-5 space-y-1 text-sm ">
                              {dosageEntries.map(([key, value], index) => (
                                <li key={index}>
                                  <strong>{key}:</strong> {value}
                                </li>
                              ))}
                            </ul>
                          );
                        }
                        return (
                          <p className="text-sm ">
                            {typeof product.dosage === "string" && product.dosage.length > 0
                              ? product.dosage
                              : "Tidak ada informasi aturan pakai & dosis untuk produk ini."}
                          </p>
                        );
                      })()}
                    </AccordionContent>
                  </AccordionItem>

                  {/* Informasi Kemasan */}
                  <AccordionItem value="packaging">
                    <AccordionTrigger>Informasi Kemasan</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between text-muted-foreground">
                          <span className="">Brand Obat:</span>
                          <span className="font-semibold text-foreground">{product.brand || '-'}</span>
                        </div>
                        <div className="flex justify-between text-muted-foreground">
                          <span className="">Jenis Kemasan:</span>
                          <span className="font-semibold text-foreground">{product.base_uom || '-'}</span>
                        </div>
                        <div className="flex justify-between text-muted-foreground">
                          <span className="">Jumlah dalam Kemasan:</span>
                          <span className="font-semibold text-foreground">
                            {product.content ? `${product.content} ${product.base_uom}` : '-'}
                          </span>
                        </div>
                        <div className="flex justify-between text-muted-foreground">
                          <span className="">Packing Kemasan:</span>
                          <span className="font-semibold text-foreground">{product.order_unit || '-'}</span>
                        </div>
                        <div className="flex justify-between text-muted-foreground">
                          <span className="">Berat Kemasan:</span>
                          <span className="font-semibold text-foreground">
                            {product.weight ? `${product.weight} gram` : '-'}
                          </span>
                        </div>
                        <div className="flex justify-between text-muted-foreground">
                          <span className="">Dimensi Kemasan:</span>
                          <span className="font-semibold text-foreground">
                            {product.length && product.width && product.height
                              ? `${product.length} x ${product.width} x ${product.height} cm`
                              : '-'}
                          </span>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>

{/* Kolom 3: Sticky Card Harga + Quantity + Add to Cart */}
<div className="lg:col-span-3">
  <Card className="sticky top-24 max-w-sm mx-auto shadow-md">
    <CardContent className="space-y-5 pt-2">
      
      {/* Judul Cart */}
      <div className="flex items-center gap-2 border-b pb-2">
        <ShoppingCart className="h-5 w-5 text-primary" />
        <h3 className="text-base font-semibold">Atur Pembelian</h3>
      </div>

      {/* Harga */}
      <div className="flex items-center justify-between">
        <p className="text-xl font-bold">Subtotal:</p>
        <div className="text-right">
          <p className="text-xl font-bold text-primary">
            Rp {product.price.toLocaleString('id-ID')}
          </p>
          <p className="text-xs text-muted-foreground">/ {product.order_unit}</p>
        </div>
      </div>

      {/* Quantity Controller */}
      <div className="flex items-center justify-center gap-4 border-1 rounded-md">
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-full"
          onClick={() => handleQuantityChange(-1)}
          disabled={quantity <= 1}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <span className="w-10 text-center font-semibold">{quantity}</span>
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-full"
          onClick={() => handleQuantityChange(1)}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Add to Cart Button */}
      <MotionButton
        size="lg"
        className={`w-full h-11 ${
          isAdded ? 'bg-emerald-500 hover:bg-emerald-600 focus:ring-emerald-400' : ''
        }`}
        disabled={!product.is_active || isAdded}
        onClick={handleAddToCartClick}
        whileTap={{ scale: 0.95 }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={isAdded ? 'added' : 'default'}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center justify-center"
          >
            {isAdded ? (
              <>
                <Check className="mr-2 h-5 w-5" /> Ditambahkan
              </>
            ) : (
              <>
                <ShoppingCart className="mr-2 h-5 w-5" /> Tambahkan
              </>
            )}
          </motion.span>
        </AnimatePresence>
      </MotionButton>
    </CardContent>
  </Card>
</div>

          </div>
        </div>
      </div>

{/* Product Recommendations */}
{relatedProducts && relatedProducts.length > 0 && (
  <div className="mb-8 p-6 lg:p-0">
    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
      <h2 className="text-2xl font-bold mb-6">Rekomendasi Produk</h2>
      
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        plugins={[
          Autoplay({
            delay: 3000, // waktu autoplay (ms)
            stopOnInteraction: false,
          }),
        ]}
        className="w-full"
      >
        <CarouselContent>
          {relatedProducts.map((relatedProduct) => (
            <CarouselItem 
              key={relatedProduct.id} 
              className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5"
            >
              <ProductCard
                product={relatedProduct}
                addToCart={(p: Product) => addToCart(p, 1)}
                compact={true}
              />
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Navigasi */}
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  </div>
)}

      {/* Floating Cart */}
      <FloatingCart totalItems={totalItems} animationTrigger={animationTrigger} />
    </HeaderLayout>
  );
};
