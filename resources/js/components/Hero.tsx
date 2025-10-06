import { useState } from "react";
import { ShoppingBag, ChevronLeft, ChevronRight } from "lucide-react";

export default function HeroCarousel() {
    const slides = [
        {
            title: (
                <>
                    Selamat Datang di <br />
                    <span className="text-yellow-400">Kimia Farma Apotek</span>
                </>
            ),
            desc: "Kami hadir untuk memberikan solusi kesehatan terlengkap dan tepercaya bagi Anda dan keluarga.",
            link: `${route('packages.index')}`,
            overlay: "bg-[url('/bg-kf.png')]",
        },
        {
            title: (
                <>
                    Produk <span className="text-yellow-400">Asli</span> dan Terjamin!
                    <br />
                    <span className="text-white">Dari Brand Terkemuka di Indonesia</span>
                </>
            ),
            desc: "Nikmati penawaran terbatas untuk berbagai produk vitamin dan suplemen pilihan. Jaga imunitas tubuh sekarang!",
            link: `${route('packages.index')}`,
            overlay: "bg-[url('/bg-kf.png')]",
        },
        {
            title: (
                <>
                    Layanan Cepat & <span className="text-yellow-400">Profesional</span>
                    <br />
                    <span className="text-white">Siap Membantu</span>
                </>
            ),
            desc: "Dapatkan produk kesehatan Anda dengan mudah dan cepat. Kepuasan Anda adalah prioritas utama kami.",
            link: `${route('dashboard')}`,
            overlay: "bg-[url('/bg-kf.png')]",
        },
    ];

    const [current, setCurrent] = useState(0);

    const prevSlide = () => {
        setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    };

    const nextSlide = () => {
        setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    };

    return (
        <div className="relative w-full h-screen overflow-hidden">
            {slides.map((slide, index) => (
                <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-1000 ${
                        index === current
                            ? "opacity-100 z-20"
                            : "opacity-0 z-10 pointer-events-none"
                    }`}
                >
                    <div className="relative h-full w-full">
                        {/* Overlay background image */}
                        <div
                            className={`absolute inset-0 bg-cover bg-center ${slide.overlay}`}
                        ></div>

                        {/* Content */}
                        <div className="relative z-10 flex h-full flex-col items-center justify-center gap-8 px-6 text-center md:flex-row md:justify-between md:px-20 md:text-left">
                            {/* Text Section */}
                            <div className="max-w-2xl">
                                <h1 className="mb-4 text-4xl font-extrabold leading-tight text-white sm:text-5xl md:text-6xl">
                                    {slide.title}
                                </h1>
                                <p className="mb-6 text-base leading-relaxed text-white/80 sm:text-lg md:mb-8 md:text-xl">
                                    {slide.desc}
                                </p>

                                <div className="flex flex-col justify-center gap-4 sm:flex-row md:justify-start">
                                    <a
                                        href={slide.link}
                                        className="flex items-center justify-center gap-2 rounded-xl bg-yellow-400 px-8 py-4 text-lg font-bold text-slate-900 shadow-lg transition-all duration-300 hover:bg-yellow-500 hover:scale-105 hover:shadow-xl"
                                    >
                                        <ShoppingBag className="h-5 w-5" />
                                        {index === 1 ? "Lihat Produk" : "Beli Paket"}
                                    </a>
                                    <a href={route('orders.products')} className="rounded-xl border-2 border-white/40 px-8 py-4 text-lg font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-white/10 hover:border-white/60">
                                        Lanjut Belanja
                                    </a>
                                </div>
                            </div>

                            {/* Image Section (hidden, as per your code) */}
                            <div className="hidden md:block">
                                {/* You can add an image here if needed */}
                                {/* <img src={slide.image} alt="image" className="w-[320px] md:w-[420px] lg:w-[480px] drop-shadow-2xl" /> */}
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            {/* Navigation Arrows */}
            <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 z-30 -translate-y-1/2 rounded-full bg-white/20 p-2 text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/40"
            >
                <ChevronLeft size={32} />
            </button>
            <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 z-30 -translate-y-1/2 rounded-full bg-white/20 p-2 text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/40"
            >
                <ChevronRight size={32} />
            </button>
        </div>
    );
}
