import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";

export default function HeroCarousel() {
    const slides = [
        {
            title: (
                <>
                    Premium <span className="text-yellow-400">Health</span> <br />
                    <span className="text-white">Experience</span>
                </>
            ),
            desc: "Pilihan terbaik untuk kesehatan keluarga Anda",
            image: "/Model2.png",
            link: "/packages",
            bg: "bg-gradient-to-r from-orange-700 via-orange-500 to-orange-700", // slide 1
            overlay: "bg-[url('/display.jpeg')]",
        },
        {
            title: (
                <>
                    Solusi <span className="text-yellow-400">Keluarga</span> <br />
                    <span className="text-white">Sehat</span>
                </>
            ),
            desc: "Produk kesehatan terpercaya untuk semua umur",
            image: "/Model3.png",
            link: "/packages",
            bg: "bg-gradient-to-r from-blue-700 via-blue-500 to-indigo-700", // slide 2
            overlay: "bg-[url('/display.jpeg')]",
        },
        {
            title: (
                <>
                    Hidup <span className="text-yellow-400">Sehat</span> <br />
                    <span className="text-white">Bersama Kami</span>
                </>
            ),
            desc: "Kualitas terbaik dengan pelayanan premium",
            image: "/Model2.png",
            link: "/packages",
            bg: "bg-gradient-to-r from-green-700 via-emerald-500 to-teal-700", // slide 3
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
        <div className="relative w-full min-h-[400px]">
            {slides.map((slide, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: -40 }}
                    animate={index === current ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                    transition={{ duration: 0.8 }}
                    className={`absolute inset-0 transition-opacity duration-700 ${
                        index === current ? "z-20" : "z-10 pointer-events-none"
                    }`}
                >
                    <div
                        className={`relative overflow-hidden rounded-3xl shadow-2xl ${slide.bg}`}
                    >
                        <div
                            className={`absolute inset-0 bg-cover bg-center opacity-20 ${slide.overlay}`}
                        ></div>

                        <div className="relative z-10 flex flex-col items-center justify-between gap-12 px-8 pt-5 md:flex-row md:px-16 lg:pt-0">
                            {/* Text Section */}
                            <motion.div
                                initial={{ opacity: 0, x: -60 }}
                                animate={index === current ? { opacity: 1, x: 0 } : { opacity: 0, x: -60 }}
                                transition={{ duration: 1, delay: 0.2 }}
                                className="max-w-2xl text-center md:text-left"
                            >
                                <h1 className="mb-6 text-5xl leading-tight font-extrabold text-white md:text-6xl">
                                    {slide.title}
                                </h1>
                                <p className="mb-8 text-lg leading-relaxed text-white/80 md:text-xl">
                                    {slide.desc}
                                </p>

                                <div className="flex flex-col justify-center gap-4 sm:flex-row md:justify-start">
                                    <a
                                        href={slide.link}
                                        className="flex items-center justify-center gap-2 rounded-full bg-yellow-400 px-8 py-6 text-lg font-bold text-slate-900 shadow-lg hover:bg-yellow-500"
                                    >
                                        <ShoppingBag className="h-5 w-5" /> Beli Paket
                                    </a>

                                    <button className="rounded-full border-2 border-white/40 px-8 py-6 text-lg font-semibold text-black backdrop-blur-sm hover:bg-white/10 dark:text-white">
                                        Lanjut Belanja
                                    </button>
                                </div>
                            </motion.div>

                            {/* Image Section */}
                            <motion.div
                                initial={{ opacity: 0, x: 60, scale: 0.8 }}
                                animate={
                                    index === current
                                        ? { opacity: 1, x: 0, scale: 1 }
                                        : { opacity: 0, x: 60, scale: 0.8 }
                                }
                                transition={{ duration: 1, delay: 0.5 }}
                            >
                                <img
                                    src={slide.image}
                                    alt="Premium Pharmacy"
                                    className="h-full w-[280px] drop-shadow-2xl md:w-[420px]"
                                />
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            ))}

        </div>
    );
}
