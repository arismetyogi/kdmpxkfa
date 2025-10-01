import PriceDisplay from '@/components/priceDisplay';
import { cn, currency } from '@/lib/utils'; // Assuming you have a utility for merging class names
import { Product } from '@/types/index.js';
import { ShoppingCart } from 'lucide-react';

interface ProductCardProps {
    product: Product;
    compact?: boolean;
    addToCart: (product: Product) => void;
    updateCartItems?: () => void;
}

export default function ProductCard({ product, compact = false, addToCart }: ProductCardProps) {
    const { id, name, price, base_uom, order_unit, image, is_active, content, category } = product;
    if (compact) {
        return (
            <div
                className="relative flex h-full cursor-pointer flex-col justify-between rounded-lg border bg-card p-2 text-card-foreground shadow-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-md active:scale-[0.98]"
                onClick={() => (window.location.href = route('orders.show', { id }))}
            >
                <div className="relative mb-2 w-full overflow-hidden rounded-md">
                    {category?.main_category && (
                        <span className="absolute top-1 right-1 z-10 rounded-full bg-secondary px-1 py-0.5 text-xs whitespace-nowrap text-secondary-foreground shadow">
                            {category.main_category}
                        </span>
                    )}
                    <div>
                        <img
                            src={image[0] ?? "/products/Placeholder_Medicine.png"}
                            alt={name}
                            className={`mb-6 h-46 w-full rounded-md object-cover transition-transform duration-300 ease-out group-hover:scale-105`}
                            onError={({ currentTarget }) => {
                                currentTarget.src = '/products/Placeholder_Medicine.png';
                                }}
                        />
                    </div>
                    <h3 className="mb-1 text-sm leading-tight font-semibold">{name.length > 25 ? name.slice(0, 16) + '...' : name}</h3>
                    <div className="flex items-center justify-between gap-1">
                        <span className={`block text-xs text-muted-foreground ${content === 1 ? 'invisible' : ''}`}>
                            {content} {base_uom} per {order_unit}
                        </span>
                        <div>
                            <p className="text-md pr-2 font-bold text-primary">{currency(price * content)}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Calculate price per order unit
    const pricePerOrderUnit = price * content;

    return (
        <div
            className="relative flex h-full cursor-pointer flex-col justify-between rounded-lg border bg-card p-2 text-card-foreground shadow-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-md active:scale-[0.98]"
            onClick={() => (window.location.href = route('orders.show', { id }))}
        >
            {category?.subcategory1 && (
                <span className="absolute top-2 right-2 rounded-full bg-blue-600 px-2 py-1 text-xs whitespace-nowrap text-white shadow">
                    {category.subcategory1}
                </span>
            )}

            {/* Bagian Atas */}
            <div>
                <img
                    src={image[0] ?? '/products/Placeholder_Medicine.png'}
                    alt={name}
                    className="mb-4 h-36 w-full rounded-md object-cover"
                    onError={({ currentTarget }) => {
                        currentTarget.src = '/products/Placeholder_Medicine.png';
                    }}
                />

                <h3 className="mb-1 text-sm leading-tight font-semibold md:text-base">{name.length > 16 ? name.slice(0, 16) + '...' : name}</h3>

                <span className={`block text-xs text-muted-foreground ${content === 1 ? 'invisible' : ''}`}>
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
                <PriceDisplay price={pricePerOrderUnit} className="text-lg font-bold text-blue-600 md:text-xl" decimal="hidden" />

                <p className="text-xs text-muted-foreground">
                    <PriceDisplay price={price} /> per {base_uom}
                </p>

                <button
                    disabled={!is_active}
                    onClick={(e) => {
                        e.stopPropagation();
                        addToCart(product);
                    }}
                    className={cn(
                        'mt-2 flex w-full items-center justify-center gap-2 rounded px-3 py-2 font-semibold transition-all duration-200',
                        is_active
                            ? 'bg-blue-600 text-primary-foreground hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98] active:bg-blue-800' // Active state with animations
                            : 'cursor-not-allowed bg-muted text-muted-foreground', // Disabled state
                    )}
                >
                    <ShoppingCart size={16} /> Add to Cart
                </button>
            </div>
        </div>
    );
}
