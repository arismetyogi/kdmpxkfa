import { Product } from '@/types/index.js';
import { useForm } from '@inertiajs/react';
import { ShoppingCart } from 'lucide-react';

export default function ProductCard({ product }: { product: Product }) {
    const { name, price, base_uom, order_unit, image, is_active, content, category } = product;

    // Calculate price per order unit
    const pricePerOrderUnit = price * content;

    const form = useForm<{ productId: number; quantity: number }>({
        productId: product.id,
        quantity: 1,
    });

    // 🔹 Fungsi Add to Cart
    const addToCart = () => {
        form.post(route('carts.store'), {
            preserveScroll: true,
            preserveState: true,
            onError: (err: any) => {
                console.log(err);
            },
        });
        console.log('product: ', product);
    };

    return (
        <div className="relative flex h-full flex-col justify-between rounded-lg border p-3 shadow-sm transition-colors">
            {/* Floating Category Badge */}
            {category?.main_category && (
                <span className="absolute top-2 right-2 rounded-full bg-blue-100 px-2 py-1 text-xs whitespace-nowrap text-blue-800 shadow">
                    {category.main_category}
                </span>
            )}

            {/* Bagian Atas */}
            <div>
                <img src={image || '/logo.svg' } alt={name} className="mb-4 h-36 w-fit rounded-md object-cover" />

                <h3 className="mb-1 text-sm leading-tight font-semibold md:text-base">{name.length > 16 ? name.slice(0, 16) + '...' : name}</h3>

                <span className="block text-xs text-muted-foreground">
                    {content} {base_uom} per {order_unit}
                </span>

                <p className="mt-1 text-sm text-gray-500">
                    Status:{' '}
                    {is_active ? (
                        <span className="font-semibold text-blue-600">Tersedia</span>
                    ) : (
                        <span className="font-semibold text-red-600">HABIS</span>
                    )}
                </p>
            </div>

            {/* Bagian Bawah */}
            <div className="mt-3">
                <p className="text-lg font-bold text-blue-600 md:text-xl">Rp {pricePerOrderUnit?.toLocaleString() ?? '0'}</p>
                <p className="text-xs text-muted-foreground">
                    Rp {price?.toLocaleString() ?? '0'} per {base_uom}
                </p>

                <button
                    disabled={!is_active}
                    onClick={(e) => {
                        e.stopPropagation();
                        addToCart();
                    }}
                    className={`mt-2 flex w-full items-center justify-center gap-2 rounded px-3 py-2 font-semibold text-white transition-colors ${
                        is_active ? 'bg-blue-600 hover:bg-blue-700' : 'cursor-not-allowed bg-gray-400'
                    }`}
                >
                    <ShoppingCart size={16} /> Add to Cart
                </button>
            </div>
        </div>
    );
}
