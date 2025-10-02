import Footer from '@/components/Footer';
import HeroCarousel from '@/components/HeroCarousel';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import AppHeaderLayout from '@/layouts/app/app-header-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import Autoplay from 'embla-carousel-autoplay';
import { motion } from 'framer-motion';
import { HeartPulse, Pill, RefreshCw, ShieldCheck, ShoppingBag, ShoppingCart, Syringe, Truck } from 'lucide-react';
import { useState } from 'react';

type Product = {
    id: number;
    name: string;
    slug: string;
    description: string;
    price: number;
    category_id: number;
    image?: string;
    image_alt?: string;
};

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Dashboard', href: route('dashboard') }];

const categoryMap: Record<number, string> = {
    1: 'Obat',
    2: 'Vitamin',
    3: 'Perawatan Tubuh',
    4: 'Alat Kesehatan',
    5: 'Herbal',
};

const categoryCards = [
    {
        id: 1,
        name: 'Obat - Obatan',
        desc: 'Resep & Bebas Terlengkap',
        icon: Pill,
        color: 'text-blue-600 bg-blue-100 dark:text-blue-200 dark:bg-blue-900/40',
        image: 'https://images.unsplash.com/photo-1577401132921-cb39bb0adcff?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
        id: 2,
        name: 'Vitamin & Multivitamin',
        desc: 'Suplemen Premium Import',
        icon: HeartPulse,
        color: 'text-emerald-600 bg-emerald-100 dark:text-emerald-200 dark:bg-emerald-900/40',
        image: 'https://plus.unsplash.com/premium_photo-1730988915408-209c1ab59554?q=80&w=2224&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
        id: 3,
        name: 'Perawatan Tubuh',
        desc: 'Kesehatan Preventif Terbaik',
        icon: Syringe,
        color: 'text-rose-600 bg-rose-100 dark:text-rose-200 dark:bg-rose-900/40',
        image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
];

export default function Dashboard({ products, top_products }: { products?: Product[]; top_products?: Product[] }) {
    const [activeCategory, setActiveCategory] = useState('Semua');

    const categories = ['Semua', ...new Set(Object.values(categoryMap))];

    const filteredProducts = activeCategory === 'Semua' ? products : products?.filter((p) => categoryMap[p.category_id] === activeCategory);

    return (
        <AppHeaderLayout breadcrumbs={breadcrumbs}>
            <Head title="KFA" />

            <div className="min-h-screen from-slate-50 via-blue-50/30 to-indigo-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
                <div className="mx-auto flex max-w-7xl flex-col gap-12 py-4 md:gap-20">
                    {/* Hero Section */}
                    <main className="relative">
                        <HeroCarousel />
                    </main>

                    {/* Kategori Cards */}
                    <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}>
                        <div className="mb-8 text-center">
                            <h2 className="mb-2 text-2xl font-bold text-slate-800 md:text-3xl dark:text-slate-100">Kategori Pilihan</h2>
                            <p className="text-slate-600 dark:text-slate-400">Pilihan terbaik untuk kesehatan keluarga Anda</p>
                        </div>

                        <div className="flex justify-center">
                            <div className="grid w-full max-w-6xl grid-cols-1 justify-items-center gap-6 sm:grid-cols-2 md:grid-cols-3">
                                {categoryCards.map((cat, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.6, delay: 0.1 * idx }}
                                        whileHover={{ y: -8, scale: 1.02 }}
                                        className="w-full max-w-sm"
                                    >
                                        <Link href={route('orders.products', { categories: [cat.name] })}>
                                            <Card className="group relative h-72 w-full cursor-pointer overflow-hidden rounded-2xl shadow-md transition-all duration-300 hover:shadow-xl">
                                                {/* Background Image: Zooms in on hover */}
                                                <div
                                                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-in-out group-hover:scale-105"
                                                    style={{ backgroundImage: `url(${cat.image})` }}
                                                />
                                                <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/50 to-transparent p-4 transition-all duration-300 ease-in-out group-hover:opacity-0">
                                                    <h3 className="text-xl font-bold text-white">{cat.name}</h3>
                                                </div>
                                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-t from-black/70 to-black/10 p-6 text-center text-white opacity-0 transition-opacity duration-500 ease-in-out group-hover:opacity-100">
                                                    <div className="translate-y-4 transform transition-transform duration-500 ease-in-out group-hover:translate-y-0">
                                                        <h3 className="text-2xl font-bold">{cat.name}</h3>
                                                        <p className="mt-2 text-sm opacity-90">{cat.desc}</p>
                                                        <button className="mt-6 w-fit rounded-full bg-white px-6 py-2 text-sm font-semibold text-slate-900 shadow-md transition-all duration-300 hover:scale-105 hover:bg-slate-200">
                                                            Explore
                                                        </button>
                                                    </div>
                                                </div>
                                            </Card>
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>

        <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        >
        <div className="mb-6 text-center">
            <h2 className="mb-1 text-xl font-bold text-slate-800 md:text-2xl dark:text-slate-100">
            Produk Terlaris
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
            Pilihan favorit pelanggan premium kami
            </p>
        </div>

        <Carousel
            opts={{ align: "start", loop: true }}
            plugins={[Autoplay({ delay: 4000 })]}
            className="w-full"
        >
            <CarouselContent className="-ml-2">
            {top_products?.map((p) => (
                <CarouselItem
                key={p.id}
                className="basis-1/2 pl-2 sm:basis-1/3 md:basis-1/4 lg:basis-1/6" 
                >
                <motion.div whileHover={{ y: -2 }} className="group h-full">
                    <Card className="relative h-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-md dark:border-slate-700 dark:bg-slate-800">
                    <div className="relative overflow-hidden">
                        <img
                        src={Array.isArray(p.image) ? p.image[0] : '/products/Placeholder_Medicine.png'}
                        alt={p.image_alt || p.name}
                        className="h-28 w-full object-cover transition-transform duration-500 group-hover:scale-105 sm:h-32"
                        />
                    </div>
                    <CardContent className="p-2">
                        <h3 className="mb-1 line-clamp-1 text-xs font-medium text-slate-800 dark:text-slate-100">
                        {p.name}
                        </h3>
                        <div className="flex items-center">
                        <span className="text-sm font-bold text-blue-600">
                            Rp {p.price.toLocaleString("id-ID")}
                        </span>
                        </div>
                    </CardContent>
                    </Card>
                </motion.div>
                </CarouselItem>
            ))}
            </CarouselContent>

            <CarouselPrevious className="hidden border-0 bg-white shadow-md sm:flex dark:bg-slate-700/80" />
            <CarouselNext className="hidden border-0 bg-white shadow-md sm:flex dark:bg-slate-700/80" />
        </Carousel>
        </motion.div>

    <section className="w-full overflow-x-hidden py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid items-center gap-12 md:grid-cols-2 lg:gap-20"
            >
            {/* Image Section */}
            <div className="w-full">
                <img
                src="/Package (2).png"
                alt="Paket Koperasi Merah Putih"
                className="h-full w-full max-w-full rounded-3xl object-cover shadow-lg transition-transform duration-500 hover:scale-105"
                />
            </div>

            {/* Content Section */}
            <div className="flex flex-col text-center md:text-left">
                <h2 className="mb-6 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl dark:text-white">
                Paket Koperasi Merah Putih
                </h2>

                <p className="mb-8 max-w-lg text-lg leading-relaxed text-slate-600 md:mx-0 dark:text-slate-300">
                Paket Obat lengkap senilai{" "}
                <span className="font-semibold text-blue-700 dark:text-blue-400">30 juta</span>{" "}
                untuk mengisi kebutuhan koperasi Anda dengan produk berkualitas.
                </p>

                <div className="flex justify-center md:justify-start">
                <Link href={route('packages.index')}>
                    <Button
                    size="lg"
                    className="rounded-xl bg-blue-700 px-8 py-4 text-base font-semibold text-white shadow-md transition hover:scale-105 hover:bg-blue-600 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
                    >
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Buy Package Now
                    </Button>
                </Link>
                </div>

                {/* Features */}
                <div className="mt-12 flex flex-nowrap items-center justify-center gap-x-6 text-sm font-medium text-slate-600 md:justify-start dark:text-slate-400">
                    <div className="flex items-center gap-2">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-slate-700 dark:text-green-400">
                        <RefreshCw className="h-4 w-4" />
                        </span>
                        30-day returns
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 text-purple-600 dark:bg-slate-700 dark:text-purple-400">
                        <ShieldCheck className="h-4 w-4" />
                        </span>
                        Warranty included
                    </div>
                    </div>
            </div>
            </motion.div>
        </div>
        </section>

                    {/* Grid Produk */}
                    {/* <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.5 }}>
                        <div className="mb-8 text-center">
                            <h2 className="mb-2 text-2xl font-bold text-slate-800 md:text-3xl dark:text-slate-100">Katalog Premium</h2>
                            <p className="text-slate-600 dark:text-slate-400">Jelajahi koleksi lengkap produk berkualitas tinggi</p>
                        </div>
                        <div className="mb-8 flex flex-wrap justify-center gap-2 md:gap-3">
                            {(categories ?? []).map((cat) => (
                                <Button
                                    key={cat}
                                    variant={activeCategory === cat ? 'default' : 'outline'}
                                    className={`rounded-full px-5 py-2 text-sm font-semibold transition-all duration-300 md:px-6 md:py-3 md:text-base ${
                                        activeCategory === cat
                                            ? 'scale-105 bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                                            : 'border-2 border-blue-200 text-slate-700 hover:bg-blue-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800'
                                    }`}
                                    onClick={() => setActiveCategory(cat)}
                                >
                                    {cat}
                                </Button>
                            ))}
                        </div>

                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-6 lg:grid-cols-4">
                            {(filteredProducts ?? []).map((p, idx) => (
                                <motion.div
                                    key={p.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.1 * idx }}
                                    whileHover={{ y: -8, scale: 1.02 }}
                                    className="group"
                                >
                                    <Card className="relative flex h-full flex-col overflow-hidden rounded-2xl border-0 bg-white shadow-xl backdrop-blur-sm hover:shadow-2xl md:rounded-3xl dark:bg-slate-800">
                                        <div className="relative overflow-hidden">
                                            <img
                                                src={Array.isArray(p.image) ? p.image[0] : '/products/Placeholder_Medicine.png'}
                                                alt={p.name}
                                                className="h-40 w-full object-cover transition-transform duration-700 group-hover:scale-110 sm:h-48"
                                            />
                                        </div>
                                        <CardContent className="flex flex-1 flex-col p-4 md:p-6">
                                            <h3 className="mb-1 line-clamp-1 font-bold text-slate-800 md:mb-2 dark:text-slate-100">{p.name}</h3>
                                            <p className="mb-2 line-clamp-2 flex-1 text-sm text-slate-500 md:mb-3 dark:text-slate-400">
                                                {p.description}
                                            </p>
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-base font-bold text-blue-600 md:text-lg">
                                                    Rp {p.price.toLocaleString('id-ID')}
                                                </span>
                                            </div>
                                            <Button
                                                asChild
                                                className="mt-auto w-full rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 py-2.5 text-sm font-semibold text-white shadow-md hover:from-blue-700 hover:to-blue-800 md:rounded-2xl md:text-base"
                                            >
                                                <Link href="#">
                                                    <ShoppingBag className="mr-2 h-4 w-4" /> Lihat Detail
                                                </Link>
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div> */}
                </div>
            </div>
            <Footer />
        </AppHeaderLayout>
    );
}
