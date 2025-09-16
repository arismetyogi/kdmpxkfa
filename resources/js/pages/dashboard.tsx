import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import AppHeaderLayout from '@/layouts/app/app-header-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import Autoplay from 'embla-carousel-autoplay';
import { motion } from 'framer-motion';
import { HeartPulse, Pill, ShoppingBag, Syringe } from 'lucide-react';
import { useEffect, useState } from 'react';

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

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Dashboard', href: '/dashboard' }];

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
    },
    {
        id: 2,
        name: 'Vitamin & Multivitamin',
        desc: 'Suplemen Premium Import',
        icon: HeartPulse,
        color: 'text-emerald-600 bg-emerald-100 dark:text-emerald-200 dark:bg-emerald-900/40',
    },
    {
        id: 3,
        name: 'Perawatan Tubuh',
        desc: 'Kesehatan Preventif Terbaik',
        icon: Syringe,
        color: 'text-rose-600 bg-rose-100 dark:text-rose-200 dark:bg-rose-900/40',
    },
];

export default function Dashboard({ products }: { products?: Product[] }) {
    const [activeCategory, setActiveCategory] = useState('Semua');
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        setLoading(false);
    }, []);

    const categories = ['Semua', ...new Set(Object.values(categoryMap))];

    const filteredProducts = activeCategory === 'Semua' ? products : products?.filter((p) => categoryMap[p.category_id] === activeCategory);

    if (loading) {
        return (
            <AppHeaderLayout breadcrumbs={breadcrumbs}>
                <Head title="KFA" />
                <div className="flex min-h-screen items-center justify-center">
                    <p className="text-xl text-slate-500">Memuat produk...</p>
                </div>
            </AppHeaderLayout>
        );
    }

    return (
        <AppHeaderLayout breadcrumbs={breadcrumbs}>
            <Head title="KFA" />

            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
                <div className="mx-auto flex max-w-7xl flex-col gap-20 p-4 md:p-8">
                    {/* Hero Section */}
                    <motion.div
                        initial={{ opacity: 0, y: -40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 via-blue-800 to-indigo-700 shadow-2xl"
                    >
                        <div className="absolute inset-0 bg-[url('/pattern.svg')] bg-cover bg-center opacity-20"></div>
                        <div className="relative z-10 flex flex-col items-center justify-between gap-12 px-8 py-20 md:flex-row md:px-16">
                            <motion.div
                                initial={{ opacity: 0, x: -60 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 1, delay: 0.2 }}
                                className="max-w-2xl text-center md:text-left"
                            >
                                <h1 className="mb-6 text-5xl leading-tight font-extrabold text-white md:text-6xl">
                                    Premium <span className="text-yellow-400">Health</span> <br />
                                    <span className="text-white">Experience</span>
                                </h1>
                                <p className="mb-8 text-lg leading-relaxed text-white/80 md:text-xl">Pilihan terbaik untuk kesehatan keluarga Anda</p>
                                <div className="flex flex-col justify-center gap-4 sm:flex-row md:justify-start">
                                    <Button className="rounded-full bg-yellow-400 px-8 py-6 text-lg font-bold text-slate-900 shadow-lg hover:bg-yellow-500">
                                        <ShoppingBag className="mr-2 h-5 w-5" /> Mulai Belanja
                                    </Button>
                                    <a href="https://www.kimiafarmaapotek.co.id/">
                                        <Button
                                            variant="outline"
                                            className="rounded-full border-2 border-white/40 px-8 py-6 text-lg font-semibold text-black backdrop-blur-sm hover:bg-white/10 dark:text-white"
                                        >
                                            About Us
                                        </Button>
                                    </a>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: 60, scale: 0.8 }}
                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                transition={{ duration: 1, delay: 0.4 }}
                            >
                                <img
                                    src="/Logo KFA member of BioFarma 300x300-01.png"
                                    alt="Premium Pharmacy"
                                    className="w-[280px] drop-shadow-2xl md:w-[420px]"
                                />
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Kategori Cards */}
                    <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}>
                        <div className="mb-8 text-center">
                            <h2 className="mb-2 text-3xl font-bold text-slate-800 dark:text-slate-100">Kategori Pilihan</h2>
                            <p className="text-slate-600 dark:text-slate-400">Pilihan terbaik untuk kesehatan keluarga Anda</p>
                        </div>
                        <div className="flex justify-center">
                            <div className="grid w-full max-w-6xl grid-cols-1 justify-items-center gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
                                {categoryCards.map((cat, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.6, delay: 0.1 * idx }}
                                        whileHover={{ y: -8, scale: 1.05 }}
                                        className="w-full max-w-xs"
                                    >
                                        <Link href={route('orders.products', { categories: cat.name })}>
                                            <Card className="group rounded-2xl border bg-white transition-all duration-300 hover:shadow-xl dark:bg-slate-800">
                                                <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                                                    <div className={`${cat.color} mb-4 rounded-full p-4 transition-transform group-hover:scale-110`}>
                                                        <cat.icon className="h-6 w-6" />
                                                    </div>
                                                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{cat.name}</h3>
                                                    <p className="text-sm text-slate-500 dark:text-slate-400">{cat.desc}</p>
                                                </CardContent>
                                            </Card>
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* Carousel Produk */}
                    <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }}>
                        <div className="mb-8 text-center">
                            <h2 className="mb-2 text-3xl font-bold text-slate-800 dark:text-slate-100">Produk Terlaris</h2>
                            <p className="text-slate-600 dark:text-slate-400">Pilihan favorit pelanggan premium kami</p>
                        </div>
                        <Carousel opts={{ align: 'start', loop: true }} plugins={[Autoplay({ delay: 4000 })]} className="w-full">
                            <CarouselContent className="-ml-4">
                                {products?.map((p) => (
                                    <CarouselItem key={p.id} className="basis-1/2 pl-4 md:basis-1/3 lg:basis-1/4">
                                        <motion.div whileHover={{ y: -4 }} className="group h-full">
                                            <Card className="relative h-full overflow-hidden rounded-3xl border-0 bg-white shadow-lg backdrop-blur-sm hover:shadow-2xl dark:bg-slate-800">
                                                <div className="relative overflow-hidden">
                                                    <img
                                                        src={p.image || '/placeholder.jpg'}
                                                    alt={p.image_alt || p.name}
                                                        className="h-48 w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                    />
                                                </div>
                                                <CardContent className="p-6">
                                                    <h3 className="mb-2 line-clamp-1 font-bold text-slate-800 dark:text-slate-100">{p.name}</h3>
                                                    <p className="mb-3 line-clamp-2 text-sm text-slate-500 dark:text-slate-400">{p.description}</p>
                                                    <div className="mb-3 flex items-baseline gap-2">
                                                        <span className="text-lg font-bold text-blue-600">Rp {p.price.toLocaleString('id-ID')}</span>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                            <CarouselPrevious className="left-0 border-0 bg-white shadow-lg backdrop-blur-sm dark:bg-slate-700/80" />
                            <CarouselNext className="right-0 border-0 bg-white shadow-lg backdrop-blur-sm dark:bg-slate-700/80" />
                        </Carousel>
                    </motion.div>

                    {/* Banner Promo */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="relative overflow-hidden rounded-3xl shadow-2xl"
                    >
                        <div className="grid items-center bg-gradient-to-r from-indigo-900 to-blue-700 md:grid-cols-2">
                            <div className="space-y-6 p-10 text-white md:p-16">
                                <h2 className="text-3xl leading-tight font-extrabold md:text-5xl">
                                    📢 MAKIN HEMAT BELANJA DI KIMIA FARMA APOTEK! 🎉
                                </h2>
                                <p className="text-lg text-white/80">
                                    Gunakan kartu/layanan dari bank pilihanmu & nikmati promo menarik mulai dari
                                    <span className="font-bold text-yellow-300"> Rp75.000 </span>
                                    dan promo spesial lainnya ✨
                                </p>
                                <a href="https://www.instagram.com/p/DOLfje-EqgW/?img_index=2">
                                    <Button className="rounded-full bg-yellow-400 px-8 py-6 text-lg font-bold text-slate-900 shadow-lg hover:bg-yellow-500">
                                        Belanja Sekarang
                                    </Button>
                                </a>
                            </div>
                            <div className="relative h-64 md:h-full">
                                <img src="/promo kf.jpg" alt="Promo Banner" className="absolute inset-0 h-full w-full object-cover" />
                                <div className="absolute inset-0 bg-black/20"></div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Grid Produk */}
                    <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.5 }}>
                        <div className="mb-8 text-center">
                            <h2 className="mb-2 text-3xl font-bold text-slate-800 dark:text-slate-100">Katalog Premium</h2>
                            <p className="text-slate-600 dark:text-slate-400">Jelajahi koleksi lengkap produk berkualitas tinggi</p>
                        </div>

                        {/* Category buttons */}
                        <div className="mb-8 flex flex-wrap justify-center gap-3">
                            {(categories ?? []).map((cat) => (
                                <Button
                                    key={cat}
                                    variant={activeCategory === cat ? 'default' : 'outline'}
                                    className={`rounded-full px-6 py-3 font-semibold transition-all duration-300 ${
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

                        {/* Product grid */}
                        <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-4">
                            {(filteredProducts ?? []).map((p, idx) => (
                                <motion.div
                                    key={p.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.1 * idx }}
                                    whileHover={{ y: -8, scale: 1.02 }}
                                    className="group"
                                >
                                    <Card className="relative flex h-full flex-col overflow-hidden rounded-3xl border-0 bg-white shadow-xl backdrop-blur-sm hover:shadow-2xl dark:bg-slate-800">
                                        <div className="relative overflow-hidden">
                                            <img
                                                src={p.image ? `/storage/${p.image}` : '/placeholder.jpg'}
                                                alt={p.name}
                                                className="h-48 w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                        </div>
                                        <CardContent className="flex flex-1 flex-col p-6">
                                            <h3 className="mb-2 line-clamp-1 font-bold text-slate-800 dark:text-slate-100">{p.name}</h3>
                                            <p className="mb-3 line-clamp-2 flex-1 text-sm text-slate-500 dark:text-slate-400">{p.description}</p>
                                            <div className="mb-3 flex items-baseline gap-2">
                                                <span className="text-lg font-bold text-blue-600">Rp {p.price.toLocaleString('id-ID')}</span>
                                            </div>
                                            <Button
                                                asChild
                                                className="mt-auto w-full rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 font-semibold text-white shadow-md hover:from-blue-700 hover:to-blue-800"
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
                    </motion.div>
                </div>
            </div>

            <Footer />
        </AppHeaderLayout>
    );
}
