import FloatingCart from '@/components/FloatingCart';
import { ImageCarousel } from '@/components/image-carousel';
import ProductCard from '@/components/product-card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import HeaderLayout from '@/layouts/header-layout';
import { currency } from '@/lib/utils';
import { type BreadcrumbItem, CartItem, Product } from '@/types';
import { Head } from '@inertiajs/react';
import Autoplay from 'embla-carousel-autoplay';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Minus, Plus, ShoppingCart } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

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

    // MODIFICATION: Calculate subtotal dynamically based on quantity
    const subtotal = useMemo(() => {
        // The price per order unit is (base price * content)
        const pricePerOrderUnit = product.price * product.content;
        return pricePerOrderUnit * quantity;
    }, [product, quantity]);

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
        // Calculate price per order unit (price * content)
        const pricePerOrderUnit = productToAdd.price * productToAdd.content;

        setCart((prevCart) => {
            const existingItem = prevCart.find((item) => item.id === productToAdd.id);
            let newCart;
            if (existingItem) {
                newCart = prevCart.map((item) => (item.id === productToAdd.id ? { ...item, quantity: item.quantity + quantityToAdd } : item));
            } else {
                // Create new cart item with the price per order unit
                const newCartItem: Omit<CartItem, 'total'> = {
                    ...productToAdd,
                    price: pricePerOrderUnit, // Use price per order unit
                    quantity: quantityToAdd,
                };
                newCart = [...prevCart, newCartItem as CartItem];
            }
            localStorage.setItem('cart', JSON.stringify(newCart));
            return newCart;
        });
        setAnimationTrigger((prev) => prev + 1);
    };

    const handleQuantityChange = (amount: number) => {
        setQuantity((prev) => Math.max(1, prev + amount));
    };

    const handleAddToCartClick = () => {
        if (isAdded) return;
        addToCart(product, quantity);
        setIsAdded(true);
    };

    return (
        <HeaderLayout breadcrumbs={breadcrumbs}>
            <Head title={product.name} />

            <div className="py-6 md:py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Grid 3 kolom */}
                    <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2 lg:grid-cols-12 lg:gap-14 lg:p-0">
                        {/* Kolom 1: Gambar Produk dengan Lens */}
                        <div className="lg:col-span-4">
                            <ImageCarousel images={product.image} productName={product.name} />
                        </div>

                        {/* Kolom 2: Informasi Produk */}
                        <div className="flex flex-col lg:col-span-5">
                            <div className="flex items-start justify-between gap-4">
                                <h1 className="text-2xl font-extrabold tracking-tight lg:text-3xl">{product.name}</h1>
                                {product.category?.main_category && (
                                    <Badge variant="secondary" className="mt-1 shrink-0">
                                        {product.category.main_category}
                                    </Badge>
                                )}
                            </div>
                            <p className="mt-1 text-sm text-muted-foreground">
                                {product.weight} gram / {product.base_uom}
                            </p>
                            <div className="mt-4 space-y-2">
                                <div className="flex items-baseline gap-2">
                                    <p className="text-3xl font-bold text-primary lg:text-4xl">{currency(product.price * product.content)}</p>
                                    <span className="text-sm text-muted-foreground">/ {product.order_unit}</span>
                                </div>
                                <div className="flex items-center gap-4 pt-1">
                                    {product.content !== 1 && (
                                        <p className="block text-xs text-muted-foreground">
                                            {product.content} {product.base_uom} / {product.order_unit}
                                        </p>
                                    )}
                                    {product.is_active ? (
                                        <Badge className="border-transparent bg-green-100 text-sm text-green-800 hover:bg-green-200 dark:bg-green-900/70 dark:text-green-300 dark:hover:bg-green-900">
                                            Tersedia
                                        </Badge>
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
                                            <p className="text-sm leading-relaxed">
                                                {product.pharmacology || 'Tidak ada deskripsi untuk produk ini.'}
                                            </p>
                                        </AccordionContent>
                                    </AccordionItem>

                                    {/* Dosage Information */}
                                    <AccordionItem value="dosage">
                                        <AccordionTrigger>Aturan Pakai & Dosis</AccordionTrigger>
                                        <AccordionContent>
                                            <p className="text-md font-bold">Aturan Pakai</p>
                                            <p className="text-sm leading-relaxed">
                                                {product.usage_direction || 'Tidak ada aturan pakai untuk produk ini.'}
                                            </p>
                                            <p className="text-md pt-2 font-bold">Larangan Konsumsi</p>
                                            {product.contraindication ? (
                                                <p className="text-sm leading-relaxed">{product.contraindication}</p>
                                            ) : (
                                                <p className="text-md font-medium">Tidak ada larangan penggunaan untuk produk ini</p>
                                            )}
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
                                                <p className="pt-2 text-sm leading-relaxed">
                                                    {product.storage || 'Tidak ada anjuran penempatan product.'}
                                                </p>
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            </div>
                        </div>

                        {/* Kolom 3: Sticky Card Harga + Quantity + Add to Cart */}
                        <div className="lg:col-span-3">
                            <Card className="sticky top-24 mx-auto w-full shadow-md">
                                <CardContent className="space-y-5 pt-2">
                                    {/* Judul Cart */}
                                    <div className="flex items-center gap-2 border-b pb-2">
                                        <ShoppingCart className="h-5 w-5 text-primary" />
                                        <h3 className="text-base font-semibold">Atur Pembelian</h3>
                                    </div>

                                    {/* Harga */}
                                    <div className="flex items-center justify-between gap-2">
                                        <p className="text-lg font-bold">Subtotal:</p>
                                        <div className="text-right">
                                            <p className="text-lg font-bold text-primary">{currency(subtotal)}</p>
                                        </div>
                                    </div>

                                    {/* Quantity Controller */}
                                    <div className="flex items-center justify-center gap-4 rounded-md border-1">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-10 w-full"
                                            onClick={() => handleQuantityChange(-1)}
                                            disabled={quantity <= 1}
                                        >
                                            <Minus className="h-4 w-4" />
                                        </Button>
                                        <input
                                            value={quantity === 0 ? '' : quantity}
                                            min={1}
                                            onChange={(e) => {
                                                const newValue = e.target.value;

                                                if (newValue === '') {
                                                    handleQuantityChange(-quantity);
                                                } else {
                                                    const num = Number(newValue);
                                                    if (!isNaN(num) && num >= 0) {
                                                        handleQuantityChange(num - quantity);
                                                    }
                                                }
                                            }}
                                            className="w-14 rounded-md text-center text-lg font-semibold"
                                        />
                                        <Button variant="ghost" size="icon" className="h-10 w-full" onClick={() => handleQuantityChange(1)}>
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </div>

                                    {/* Add to Cart Button */}
                                    <MotionButton
                                        size="lg"
                                        className={`h-11 w-full ${isAdded ? 'bg-emerald-500 hover:bg-emerald-600 focus:ring-emerald-400' : ''}`}
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
                    <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                        <h2 className="mb-6 text-2xl font-bold">Rekomendasi Produk</h2>

                        <Carousel
                            opts={{
                                align: 'start',
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
                                    <CarouselItem key={relatedProduct.id} className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5">
                                        <ProductCard product={relatedProduct} addToCart={(p: Product) => addToCart(p, 1)} compact={true} />
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
}
