import { Card, CardContent } from "@/components/ui/card";
import AppLayout from "@/layouts/app-layout";
import { type BreadcrumbItem } from "@/types";
import { Head, Link } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useState } from "react";
import { Pill, HeartPulse, Syringe, ShoppingBag } from "lucide-react";
import Footer from "@/components/Footer";

type Product = {
  id: number;
  name: string;
  sku: string;
  category_id: number;
  price: number;
  image: string | null;
  image_alt: string;
  description: string;
  brand: string;
};

type Props = {
  products?: Product[];
};

const breadcrumbs: BreadcrumbItem[] = [{ title: "Dashboard", href: "/dashboard" }];

const categoryMap: Record<number, string> = {
  1: "Obat",
  2: "Vitamin",
  3: "Perawatan Tubuh",
  4: "Alat Kesehatan",
  5: "Herbal",
};

const categoryCards = [
  {
    name: "Obat",
    desc: "Resep & Bebas Terlengkap",
    icon: Pill,
    color: "text-blue-600 bg-blue-100 dark:text-blue-200 dark:bg-blue-900/40",
  },
  {
    name: "Vitamin & Suplemen",
    desc: "Suplemen Premium Import",
    icon: HeartPulse,
    color: "text-emerald-600 bg-emerald-100 dark:text-emerald-200 dark:bg-emerald-900/40",
  },
  {
    name: "Perawatan Tubuh",
    desc: "Kesehatan Preventif Terbaik",
    icon: Syringe,
    color: "text-rose-600 bg-rose-100 dark:text-rose-200 dark:bg-rose-900/40",
  },
];

export default function Dashboard({ products = [] }: Props) {
  const [activeCategory, setActiveCategory] = useState("Semua");
  const categories = ["Semua", ...new Set(Object.values(categoryMap))];

  const filteredProducts =
    activeCategory === "Semua"
      ? products
      : products.filter((p) => categoryMap[p.category_id] === activeCategory);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="KFA" />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
        <div className="flex flex-col gap-20 p-4 md:p-8 max-w-7xl mx-auto">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative rounded-3xl bg-gradient-to-r from-indigo-900 via-blue-800 to-indigo-700 shadow-2xl overflow-hidden"
          >
            <div className="absolute inset-0 opacity-20 bg-[url('/pattern.svg')] bg-cover bg-center"></div>
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between px-8 md:px-16 py-20 gap-12">
              <motion.div
                initial={{ opacity: 0, x: -60 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="max-w-2xl text-center md:text-left"
              >
                <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6 text-white">
                  Premium <span className="text-yellow-400">Health</span> <br />
                  <span className="text-white">Experience</span>
                </h1>
                <p className="text-lg md:text-xl text-white/80 mb-8 leading-relaxed">
                  Pilihan terbaik untuk kesehatan keluarga Anda
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                  <Button className="bg-yellow-400 text-slate-900 hover:bg-yellow-500 font-bold shadow-lg px-8 py-6 rounded-full text-lg">
                    <ShoppingBag className="w-5 h-5 mr-2" /> Mulai Belanja
                  </Button>
                  <a href="https://www.kimiafarmaapotek.co.id/">
                    <Button
                      variant="outline"
                      className="border-2 border-white/40 text-black dark:text-white hover:bg-white/10 backdrop-blur-sm font-semibold px-8 py-6 rounded-full text-lg"
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
                  className="w-[280px] md:w-[420px] drop-shadow-2xl"
                />
              </motion.div>
            </div>
          </motion.div>

          {/* Kategori Cards */}
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">Kategori Pilihan</h2>
              <p className="text-slate-600 dark:text-slate-400">Pilihan terbaik untuk kesehatan keluarga Anda</p>
            </div>
            <div className="flex justify-center">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 justify-items-center max-w-6xl w-full">
                {categoryCards.map((cat, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 * idx }}
                    whileHover={{ y: -8, scale: 1.05 }}
                    className="w-full max-w-xs"
                  >
                    <Link href={route("orders.products", { categories: cat.name })}>
                      <Card className="group rounded-2xl border bg-white dark:bg-slate-800 hover:shadow-xl transition-all duration-300">
                        <CardContent className="flex flex-col items-center justify-center text-center p-6">
                          <div className={`${cat.color} p-4 rounded-full mb-4 group-hover:scale-110 transition-transform`}>
                            <cat.icon className="w-6 h-6" />
                          </div>
                          <h3 className="font-semibold text-lg text-slate-800 dark:text-slate-100">{cat.name}</h3>
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
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">Produk Terlaris</h2>
              <p className="text-slate-600 dark:text-slate-400">Pilihan favorit pelanggan premium kami</p>
            </div>
            <Carousel opts={{ align: "start", loop: true }} plugins={[Autoplay({ delay: 4000 })]} className="w-full">
  <CarouselContent className="-ml-4">
    {products.length > 0 ? (
      products.map((p) => (
        <CarouselItem key={p.id} className="pl-4 basis-1/2 md:basis-1/3 lg:basis-1/4">
          <motion.div whileHover={{ y: -4 }} className="h-full group">
            <Card className="h-full rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl border-0 bg-white dark:bg-slate-800 backdrop-blur-sm relative">
              <div className="relative overflow-hidden">
                <img
                  src={p.image && p.image.trim() !== "" ? p.image : "/placeholder.jpg"}
                  alt={p.image_alt || p.name}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-2 line-clamp-1">{p.name}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-3 line-clamp-2">{p.description}</p>
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-lg font-bold text-blue-600">Rp {p.price.toLocaleString("id-ID")}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </CarouselItem>
      ))
    ) : (
      <CarouselItem className="pl-4 basis-full">
        <Card className="p-8 text-center bg-white dark:bg-slate-800">
          <p className="text-slate-500 dark:text-slate-400">Belum ada produk tersedia</p>
        </Card>
      </CarouselItem>
    )}
  </CarouselContent>
  <CarouselPrevious className="left-0 bg-white dark:bg-slate-700/80 backdrop-blur-sm border-0 shadow-lg" />
  <CarouselNext className="right-0 bg-white dark:bg-slate-700/80 backdrop-blur-sm border-0 shadow-lg" />
</Carousel>

          </motion.div>

          {/* Banner Promo */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative rounded-3xl overflow-hidden shadow-2xl"
          >
            <div className="grid md:grid-cols-2 items-center bg-gradient-to-r from-indigo-900 to-blue-700">
              <div className="p-10 md:p-16 text-white space-y-6">
                <h2 className="text-3xl md:text-5xl font-extrabold leading-tight">
                  📢 MAKIN HEMAT BELANJA DI KIMIA FARMA APOTEK! 🎉
                </h2>
                <p className="text-lg text-white/80">
                  Gunakan kartu/layanan dari bank pilihanmu & nikmati promo menarik mulai dari
                  <span className="font-bold text-yellow-300"> Rp75.000 </span>
                  dan promo spesial lainnya ✨
                </p>
                <a href="https://www.instagram.com/p/DOLfje-EqgW/?img_index=2">
                  <Button className="bg-yellow-400 text-slate-900 hover:bg-yellow-500 font-bold px-8 py-6 rounded-full text-lg shadow-lg">
                    Belanja Sekarang
                  </Button>
                </a>
              </div>
              <div className="relative h-64 md:h-full">
                <img src="/promo kf.jpg" alt="Promo Banner" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/20"></div>
              </div>
            </div>
          </motion.div>

          {/* Grid Produk */}
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.5 }}>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">Katalog Premium</h2>
              <p className="text-slate-600 dark:text-slate-400">Jelajahi koleksi lengkap produk berkualitas tinggi</p>
            </div>
            <div className="flex gap-3 mb-8 justify-center flex-wrap">
              {categories.map((cat) => (
                <Button
                  key={cat}
                  variant={activeCategory === cat ? "default" : "outline"}
                  className={`rounded-full px-6 py-3 font-semibold transition-all duration-300 ${
                    activeCategory === cat
                      ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg scale-105"
                      : "border-2 border-blue-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-800"
                  }`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </Button>
              ))}
            </div>
            <div className="grid gap-8 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {filteredProducts.map((p, idx) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * idx }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="group"
                >
                  <Card className="rounded-3xl border-0 shadow-xl hover:shadow-2xl flex flex-col h-full bg-white dark:bg-slate-800 backdrop-blur-sm overflow-hidden relative">
                    <div className="relative overflow-hidden">
                      <img
                        src={p.image || "/placeholder.jpg"}
                        alt={p.image_alt || p.name}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    </div>
                    <CardContent className="p-6 flex-1 flex flex-col">
                      <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-2 line-clamp-1">{p.name}</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mb-3 line-clamp-2 flex-1">{p.description}</p>
                      <div className="flex items-baseline gap-2 mb-3">
                        <span className="text-lg font-bold text-blue-600">Rp {p.price.toLocaleString("id-ID")}</span>
                      </div>
                      <Button asChild className="w-full mt-auto bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-2xl shadow-md">
                        <Link href={"#"}>
                          <ShoppingBag className="w-4 h-4 mr-2" /> Lihat Detail
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
    </AppLayout>
  );
}
