import { ShoppingCart } from "lucide-react";
import { Link } from "@inertiajs/react";
import { motion, useAnimationControls } from "framer-motion";
import { useEffect, useRef } from "react";

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
      transition: { duration: 0.5, ease: "easeInOut" },
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
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6">
      <Link href={route('orders.cart')} className="relative">
        <motion.div
          animate={controls}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <button className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg hover:bg-blue-700 transition-transform duration-200">
            <ShoppingCart size={24} className="sm:size-8" />
          </button>
        </motion.div>

        {totalItems > 0 && (
          <motion.span
            key={totalItems} 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 20 }}
            className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center"
          >
            {totalItems}
          </motion.span>
        )}
      </Link>
    </div>
  );
}