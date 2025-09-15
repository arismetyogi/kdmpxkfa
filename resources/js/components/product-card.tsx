import React from "react";
import { ShoppingCart } from "lucide-react";
import { Product, CartItem } from '@/types/index.js';

interface ProductCardProps {
    product: Product;
    updateCartItems?: () => void;
}

export default function ProductCard({ product, updateCartItems }: ProductCardProps) {
    const {
        id,
        sku,
        name,
        price,
        base_uom,
        order_unit,
        image,
        is_active,
        content,
        weight,
        category,
    } = product;

    // Calculate price per order unit
    const pricePerOrderUnit = price * content;

    const addToCart = () => {
        if (!is_active) return;
        
        const newItem: CartItem = {
            id: id,
            sku: sku,
            name: name,
            price: pricePerOrderUnit,
            image: image,
            order_unit: order_unit,
            weight: weight,
            quantity: 1,
        };

        // Get current cart from localStorage
        const storedCart = localStorage.getItem("cart");
        const cart: CartItem[] = storedCart ? JSON.parse(storedCart) : [];
        
        // Check if item already exists in cart
        const existingItemIndex = cart.findIndex(item => item.sku === sku);
        
        let updatedCart;
        if (existingItemIndex >= 0) {
            // Update quantity if item exists
            updatedCart = [...cart];
            updatedCart[existingItemIndex] = {
                ...updatedCart[existingItemIndex],
                quantity: updatedCart[existingItemIndex].quantity + 1
            };
        } else {
            // Add new item to cart
            updatedCart = [...cart, newItem];
        }

        // Update localStorage
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        
        // Notify parent component to update cart items
        if (updateCartItems) {
            updateCartItems();
        }
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
                <img
                    src={image && image !== "" ? image : "/products/Placeholder_Medicine.png"}
                    alt={name}
                    className="w-full h-36 object-cover rounded-md mb-4"
                    onError={({ currentTarget }) => {
                        currentTarget.src = "/products/Placeholder_Medicine.png";
                    }}
                />

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

                {/* Full width Add to Cart button */}
                <button
                    disabled={!is_active}
                    onClick={addToCart}
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
