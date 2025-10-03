import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function HeroCarousel() {
    const slides = [
        {
            title: (
                <>
                    Premium <span className="text-yellow-400">Health</span> <br />
                    <span className="text-white">Experience</span>
                </>
            ),
            desc: 'Pilihan terbaik untuk kesehatan keluarga Anda',
            image: '/Model2.png',
            link: '/packages',
            bg: 'bg-gradient-to-r from-orange-700 via-orange-500 to-orange-700',
            overlay: "bg-[url('/display.jpeg')]",
        },
        {
            title: (
                <>
                    Solusi <span className="text-yellow-400">Keluarga</span> <br />
                    <span className="text-white">Sehat</span>
                </>
            ),
            desc: 'Produk kesehatan terpercaya untuk semua umur',
            image: '/Model3.png',
            link: '/packages',
            bg: 'bg-gradient-to-r from-blue-700 via-blue-500 to-indigo-700',
            overlay: "bg-[url('/display.jpeg')]",
        },
        {
            title: (
                <>
                    Hidup <span className="text-yellow-400">Sehat</span> <br />
                    <span className="text-white">Bersama Kami</span>
                </>
            ),
            desc: 'Kualitas terbaik dengan pelayanan premium',
            image: '/Model2.png',
            link: '/packages',
            bg: 'bg-gradient-to-r from-green-700 via-emerald-500 to-teal-700',
            overlay: "bg-[url('/display.jpeg')]",
        },
    ];

    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            nextSlide();
        }, 6000);
        return () => clearInterval(timer);
    }, []);

    const nextSlide = () => {
        setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    };

    return (
        <div className="relative min-h-[400px] w-full md:min-h-[400px]">
            {slides.map((slide, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={index === current ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ duration: 1.2 }}
                    className={`absolute inset-0 transition-opacity duration-700 ${index === current ? 'z-20' : 'pointer-events-none z-10'}`}
                >
                    <div className={`relative h-full overflow-hidden rounded-3xl shadow-2xl ${slide.bg}`}>
                        <div className={`absolute inset-0 bg-cover bg-center opacity-20 ${slide.overlay}`}></div>

                        <div className="relative z-10 flex h-full flex-col items-center justify-center gap-8 px-8 py-8 text-center md:flex-row md:justify-between md:gap-12 md:px-16 md:py-0 md:text-left">
                            {/* Text Section */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={index === current ? { opacity: 1 } : { opacity: 0 }}
                                transition={{ duration: 0.8, delay: 0.3 }}
                                className="max-w-2xl"
                            >
                                <h1 className="mb-4 text-4xl leading-tight font-extrabold text-white sm:text-5xl md:mb-6 md:text-6xl">
                                    {slide.title}
                                </h1>
                                <p className="mb-6 text-base leading-relaxed text-white/80 sm:text-lg md:mb-8 md:text-xl">{slide.desc}</p>

                                <div className="flex flex-col justify-center gap-4 sm:flex-row md:justify-start">
                                    <a
                                        href={slide.link}
                                        className="flex items-center justify-center gap-2 rounded-xl bg-yellow-400 px-8 py-4 text-lg font-bold text-slate-900 shadow-lg transition-all duration-300 hover:scale-105 hover:bg-yellow-500 hover:shadow-xl"
                                    >
                                        <ShoppingBag className="h-5 w-5" /> Beli Paket
                                    </a>
                                    <button className="rounded-xl border-2 border-white/40 px-8 py-4 text-lg font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-white/60 hover:bg-white/10">
                                        Lanjut Belanja
                                    </button>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={index === current ? { opacity: 1 } : { opacity: 0 }}
                                transition={{ duration: 0.8, delay: 0.5 }}
                                className="mt-4 hidden md:mt-0 md:block" //
                            >
                                <img
                                    src={slide.image}
                                    alt="Premium Pharmacy"
                                    className="h-full w-[240px] drop-shadow-2xl sm:w-[280px] md:w-[420px]"
                                />
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
