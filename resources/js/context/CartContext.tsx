import { CartItem } from '@/types';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

type CartContextType = {
    cartCount: number;
    updateCartFromStorage: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [cartCount, setCartCount] = useState(0);

    const updateCartFromStorage = useCallback(() => {
        const storedCart = localStorage.getItem('cart');
        if (!storedCart) {
            setCartCount(0);
            return;
        }

        const cartItems: CartItem[] = JSON.parse(storedCart);
        const count = cartItems.reduce((total, item) => total + (item.quantity || 1), 0);
        setCartCount(count);
    }, []);

    // Inisialisasi dari localStorage saat pertama kali
    useEffect(() => {
        updateCartFromStorage();

        // Dengarkan perubahan antar-tab dan event custom
        const handleStorage = (e: StorageEvent) => {
            if (e.key === 'cart') updateCartFromStorage();
        };

        window.addEventListener('storage', handleStorage);
        window.addEventListener('cart-updated', updateCartFromStorage);

        return () => {
            window.removeEventListener('storage', handleStorage);
            window.removeEventListener('cart-updated', updateCartFromStorage);
        };
    }, [updateCartFromStorage]);

    return <CartContext.Provider value={{ cartCount, updateCartFromStorage }}>{children}</CartContext.Provider>;
};

export const useCart = () => {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error('useCart must be used inside CartProvider');
    return ctx;
};
