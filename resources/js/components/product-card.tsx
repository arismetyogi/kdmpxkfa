import { cn } from '@/lib/utils'; // Assuming you have a utility for merging class names
import { Product } from '@/types/index.js';
import { motion } from "framer-motion";
import { ShoppingCart } from 'lucide-react';
import PriceDisplay from '@/components/priceDisplay'


interface ProductCardProps {
    product: Product;
    compact?: boolean;
    addToCart: (product: Product) => void;
    updateCartItems?: () => void;
}

export default function ProductCard({ product, compact = false, addToCart }: ProductCardProps) {
    const { id, name, price, base_uom, order_unit, image, is_active, content, category } = product;

    const buttonVariants = {
        hover: { scale: 1.05 },
        tap: { scale: 0.95 },
    };

    const cardVariants = {
        hover: {
            y: compact ? -3 : -5,
            boxShadow: 'var(--shadow-md)',
            transition: { duration: 0.2 },
        },
        tap: {
            scale: 0.98,
            transition: { duration: 0.1 },
        },
    };

    const imageVariants = {
        hover: {
            scale: 1.05,
            transition: { duration: 0.3 },
        },
    };

  if (compact) {
    return (
      <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-card text-card-foreground border rounded-lg p-2 shadow-sm flex flex-col justify-between h-full relative cursor-pointer"
          onClick={() => window.location.href = route('orders.show', { id })}
          variants={cardVariants}
          whileHover="hover"
          whileTap="tap"
      >
        <div className="relative w-full mb-2 overflow-hidden rounded-md">
            {category?.main_category && (
                <span className="absolute top-1 z-10 right-1 text-xs px-1 py-0.5 rounded-full bg-secondary text-secondary-foreground whitespace-nowrap shadow">
                    {category.main_category}
                </span>
            )}
            <div>
                <motion.img
                    src={image && image !== "" ? image : "/products/Placeholder_Medicine.png"}
                    alt={name}
                    className="w-full h-46 object-cover rounded-md mb-6"
                    variants={imageVariants}
                    whileHover="hover"
                    onError={({ currentTarget }) => {
                        currentTarget.src = "/products/Placeholder_Medicine.png";
                    }}
                />
            </div>
            <h3 className="font-semibold leading-tight text-sm mb-1">
                {name.length > 25 ? name.slice(0, 16) + "..." : name}
            </h3>
            <div className="flex items-center justify-between gap-1">
                <span className={`block text-xs text-muted-foreground ${content === 1 ? "invisible" : ""}`}>
                  {content} {base_uom} per {order_unit}
                </span>
                <div>
                    <PriceDisplay
                      price={price}
                      className="text-md font-bold text-primary pr-2"
                    />
                </div>
            </div>
        </div>
      </motion.div>
    );
  }

    // Calculate price per order unit
    const pricePerOrderUnit = price * content;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="relative flex h-full cursor-pointer flex-col justify-between rounded-lg border bg-card p-3 text-card-foreground shadow-sm"
            onClick={() => (window.location.href = route('orders.show', { id }))}
            variants={cardVariants}
            whileHover="hover"
            whileTap="tap"
        >
            {category?.subcategory1 && (
                <span className="absolute top-2 right-2 rounded-full bg-blue-600 px-2 py-1 text-xs whitespace-nowrap text-white shadow">
                    {category.subcategory1}
                </span>
            )}

            {/* Bagian Atas */}
            <div>
                <img
                    src={image && image !== '' ? image : '/products/Placeholder_Medicine.png'}
                    alt={name}
                    className="mb-4 h-36 w-full rounded-md object-cover"
                    onError={({ currentTarget }) => {
                        currentTarget.src = '/products/Placeholder_Medicine.png';
                    }}
                />

                <h3 className="mb-1 text-sm leading-tight font-semibold md:text-base">{name.length > 16 ? name.slice(0, 16) + '...' : name}</h3>

                <span className={`block text-xs text-muted-foreground ${content === 1 ? "invisible" : ""}`}>
                  {content} {base_uom} per {order_unit}
                </span>

                <p className="mt-1 text-sm text-muted-foreground">
                    Status:{' '}
                    {is_active ? (
                        <span className="font-semibold text-blue-600">Tersedia</span>
                    ) : (
                        <span className="font-semibold text-destructive">HABIS</span>
                    )}
                </p>
            </div>

            {/* Bagian Bawah */}
            <div className="mt-3">
                <PriceDisplay 
                    price={pricePerOrderUnit} 
                    className="text-lg font-bold text-blue-600 md:text-xl"
                />

                <p className="text-xs text-muted-foreground">
                    <PriceDisplay price={price} /> per {base_uom}
                </p>

                <motion.button
                    disabled={!is_active}
                    onClick={(e) => {
                        e.stopPropagation();
                        addToCart(product);
                    }}
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    className={cn(
                        'mt-2 flex w-full items-center justify-center gap-2 rounded px-3 py-2 font-semibold transition-colors',
                        is_active
                            ? 'bg-blue-600 text-primary-foreground' // Active state
                            : 'cursor-not-allowed bg-muted text-muted-foreground', // Disabled state
                    )}
                >
                    <ShoppingCart size={16} /> Add to Cart
                </motion.button>
            </div>
        </motion.div>
    );
}
