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
                        {/* Background Overlay */}
                        <div
                            className={`absolute inset-0 bg-cover bg-center ${slide.overlay}`}
                        ></div>

                        {/* Content */}
                        <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center md:flex-row md:items-center md:justify-between md:px-20 md:text-left">
                            {/* Text Section */}
                            <div className="flex-1 max-w-2xl pt-20 md:pt-0 space-y-4 md:space-y-6">
                                <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight text-white">
                                    {slide.title}
                                </h1>
                                <p className="text-base sm:text-lg md:text-xl leading-relaxed text-white/80">
                                    {slide.desc}
                                </p>

                                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 md:gap-8 sm:items-center md:items-start">
                                    <a
                                        href={slide.link}
                                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-yellow-400 px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg font-bold text-slate-900 shadow-md hover:bg-yellow-500 hover:scale-105 transition-transform duration-300"
                                    >
                                        <ShoppingBag className="w-5 h-5" />
                                        {index === 1 ? "Lihat Produk" : "Beli Paket"}
                                    </a>
                                    <a
                                        href={route("orders.products")}
                                        className="inline-flex items-center justify-center rounded-xl border border-white/30 px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg font-semibold text-white backdrop-blur-sm hover:bg-white/10 hover:border-white/60 transition-all duration-300"
                                    >
                                        Lanjut Belanja
                                    </a>
                                </div>
                            </div>

                           {/* Image Section */}
                            <div className="hidden md:flex flex-1 items-end justify-center h-full">
                                <img
                                    src="/modelhero.png"
                                    alt="Hero"
                                    className="w-full max-w-[420px] sm:max-w-[520px] md:max-w-[600px] lg:max-w-[700px] xl:max-w-[800px] object-contain drop-shadow-2xl max-h-[90vh]"
                                />
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
