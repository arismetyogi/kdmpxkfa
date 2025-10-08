import { useCart } from '@/context/CartContext';
import { Link } from '@inertiajs/react';
import { motion, useAnimationControls } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';
import { useEffect, useRef } from 'react';

// The component no longer needs props, as it gets its state from the CartContext.
export default function FloatingCart() {
    // Use the useCart hook to get the number of unique items in the cart.
    const { cartCount } = useCart();
    const controls = useAnimationControls();
    const isFirstRender = useRef(true);

    const jiggleAnimation = () => {
        controls.start({
            scale: [1, 1.3, 0.9, 1.15, 0.95, 1],
            rotate: [0, -5, 5, -5, 5, 0],
            transition: { duration: 0.5, ease: 'easeInOut' },
        });
    };

    // This effect runs whenever cartCount changes.
    useEffect(() => {
        // Skip the animation on the initial render.
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        // Trigger the jiggle animation. This will only happen when a new unique item
        // is added or an item is removed, because cartCount is cartItems.length.
        // It will not trigger when only the quantity of an existing item changes.
        jiggleAnimation();
    }, [cartCount]); // The dependency array ensures this effect runs only when cartCount changes.

    return (
        <div className="fixed right-4 bottom-4 sm:right-6 sm:bottom-6">
            <Link href={route('cart')} className="relative">
                <motion.div animate={controls} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <button className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition-transform duration-200 hover:bg-blue-700 sm:h-14 sm:w-14">
                        <ShoppingCart size={24} className="sm:size-8" />
                    </button>
                </motion.div>

                {/* Show the badge only if there are items in the cart. */}
                {cartCount > 0 && (
                    <motion.span
                        // Using cartCount as the key makes Framer Motion re-run the animation when the count changes.
                        key={cartCount}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                        className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white sm:h-6 sm:w-6"
                    >
                        {cartCount}
                    </motion.span>
                )}
            </Link>
        </div>
    );
}
