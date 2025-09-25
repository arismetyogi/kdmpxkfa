import { Link } from '@inertiajs/react';
import { motion, useAnimationControls } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';
import { useEffect, useRef } from 'react';

interface FloatingCartProps {
    totalItems: number;
    animationTrigger: number;
}

export default function FloatingCart({ totalItems, animationTrigger }: FloatingCartProps) {
    const controls = useAnimationControls();
    const isFirstRender = useRef(true);

    const jiggleAnimation = () => {
        controls.start({
            scale: [1, 1.3, 0.9, 1.15, 0.95, 1],
            rotate: [0, -5, 5, -5, 5, 0],
            transition: { duration: 0.5, ease: 'easeInOut' },
        });
    };

    useEffect(() => {
        if (isFirstRender.current || animationTrigger === 0) {
            isFirstRender.current = false;
            return;
        }

        jiggleAnimation();
    }, [animationTrigger]);

    return (
        <div className="fixed right-4 bottom-4 sm:right-6 sm:bottom-6">
            <Link href={route('cart')} className="relative">
                <motion.div animate={controls} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <button className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition-transform duration-200 hover:bg-blue-700 sm:h-14 sm:w-14">
                        <ShoppingCart size={24} className="sm:size-8" />
                    </button>
                </motion.div>

                {totalItems > 0 && (
                    <motion.span
                        key={totalItems}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                        className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white sm:h-6 sm:w-6"
                    >
                        {totalItems}
                    </motion.span>
                )}
            </Link>
        </div>
    );
}
