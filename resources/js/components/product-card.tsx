import { cn } from '@/lib/utils'; // Assuming you have a utility for merging class names
import { Product } from '@/types/index.js';
import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';

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
                className="relative flex h-full cursor-pointer flex-col justify-between rounded-lg border bg-card p-2 text-card-foreground shadow-sm"
                onClick={() => (window.location.href = route('orders.show', { id }))}
                variants={cardVariants}
                whileHover="hover"
                whileTap="tap"
            >
                <div className="relative mb-2 w-full overflow-hidden rounded-md">
                    {category?.main_category && (
                        <span className="absolute top-1 right-1 z-10 rounded-full bg-secondary px-1 py-0.5 text-xs whitespace-nowrap text-secondary-foreground shadow">
                            {category.main_category}
                        </span>
                    )}
                    <div>
                        <motion.img
                            src={image && image !== '' ? image : '/products/Placeholder_Medicine.png'}
                            alt={name}
                            className="mb-6 h-46 w-full rounded-md object-cover"
                            variants={imageVariants}
                            whileHover="hover"
                            onError={({ currentTarget }) => {
                                currentTarget.src = '/products/Placeholder_Medicine.png';
                            }}
                        />
                    </div>
                    <h3 className="mb-1 text-sm leading-tight font-semibold">{name.length > 25 ? name.slice(0, 16) + '...' : name}</h3>
                    <div className="flex items-center justify-between gap-1">
                        <span className="block text-xs text-muted-foreground">
                            {content} {base_uom} per {order_unit}
                        </span>
                        <div>
                            <p className="text-md pr-2 font-bold text-primary">Rp {price?.toLocaleString('id-ID') ?? '0'}</p>
                        </div>
                    </div>
                </div>
            </motion.div>
        );
    }

    // Calculate price per order unit
    const pricePerOrderUnit = price / content;

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

                <span className="block text-xs text-muted-foreground">
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
                <p className="text-lg font-bold text-blue-600 md:text-xl">Rp {price?.toLocaleString() ?? '0'}</p>
                <p className="text-xs text-muted-foreground">
                    Rp {pricePerOrderUnit?.toLocaleString() ?? '0'} per {base_uom}
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
