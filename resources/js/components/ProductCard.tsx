import React from "react";
import { ShoppingCart } from "lucide-react";
import { Product } from '@/types/index.js';
import { useForm } from '@inertiajs/react';

export default function ProductCard({product}: { product: Product }) {
    const {
        name,
        price,
        base_uom,
        order_unit,
        image,
        is_active,
        content,
        category,
    } = product;

    const form = useForm<{productId: number, quantity: number}>({
        productId: product.id,
        quantity: 1
    });

    // 🔹 Fungsi Add to Cart
    const addToCart = () => {
        form.post(route('carts.store'), {
            preserveScroll: true,
            preserveState: true,
            onError: (err: any) => {
                console.log(err)
            },
        })
        console.log('product: ', product);
    };

    return (
        <div className="border rounded-lg p-3 shadow-sm transition-colors flex flex-col justify-between h-full relative">

            {/* Floating Category Badge */}
            {category?.main_category && (
                <span className="absolute top-2 right-2 text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800 whitespace-nowrap shadow">
          {category.main_category}
        </span>
            )}

            {/* Bagian Atas */}
            <div>
                <img
                    src={image}
                    alt={name}
                    className="w-full h-36 object-cover rounded-md mb-4"
                />

                <h3 className="font-semibold leading-tight text-sm md:text-base mb-1">
                    {name.length > 16 ? name.slice(0, 16) + "..." : name}
                </h3>

                <span className="text-xs text-muted-foreground block">
          {content} {base_uom} per {order_unit}
        </span>

                <p className="text-sm text-gray-500 mt-1">
                    Status:{" "}
                    {is_active ? (
                        <span className="font-semibold text-blue-600">Tersedia</span>
                    ) : (
                        <span className="font-semibold text-red-600">HABIS</span>
                    )}
                </p>
            </div>

            {/* Bagian Bawah */}
            <div className="mt-3">
                <p className="text-lg md:text-xl font-bold text-blue-600">
                    Rp {price?.toLocaleString() ?? "0"}
                </p>

                <button
                    disabled={!is_active}
                    onClick={(e) => {
                        e.stopPropagation();
                        addToCart();
                    }}
                    className={`w-full flex items-center justify-center gap-2 mt-2 px-3 py-2 rounded text-white font-semibold transition-colors ${
                        is_active
                            ? "bg-blue-600 hover:bg-blue-700"
                            : "bg-gray-400 cursor-not-allowed"
                    }`}
                >
                    <ShoppingCart size={16} /> Add to Cart
                </button>
            </div>
        </div>
    );
}
