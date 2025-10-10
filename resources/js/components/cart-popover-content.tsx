import { currency } from '@/lib/utils';
import { type CartItem } from '@/types'; // Make sure this type is defined in your types file
import { Link } from '@inertiajs/react';
// ======================= CHANGE 1: Import the X icon =======================
import { ShoppingCart, X } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';

export function CartPopoverContent() {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    const loadCartItems = useCallback(() => {
        const storedCart = localStorage.getItem('cart');
        setCartItems(storedCart ? JSON.parse(storedCart) : []);
    }, []);

    useEffect(() => {
        loadCartItems(); // Load initial cart data
        window.addEventListener('cart-updated', loadCartItems);
        return () => window.removeEventListener('cart-updated', loadCartItems);
    }, [loadCartItems]);

    // ======================= CHANGE 2: Add a function to handle item removal =======================
    const handleRemoveItem = (itemId: string | number) => {
        // Filter out the item to be removed
        const updatedCart = cartItems.filter((item) => item.id !== itemId);

        // Update the local state to re-render the component immediately
        setCartItems(updatedCart);

        // Update localStorage with the new cart data
        localStorage.setItem('cart', JSON.stringify(updatedCart));

        // Dispatch a custom event to notify other components (like the header count)
        // that the cart has changed.
        window.dispatchEvent(new CustomEvent('cart-updated'));
    };

    const subtotal = cartItems.reduce((total, item) => total + item.price * item.content * (item.quantity || 1), 0);

    if (cartItems.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-8 text-center">
                <ShoppingCart className="mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="text-lg font-semibold">Your cart is empty</h3>
                <p className="text-sm text-muted-foreground">Add items to get started.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between">
                <h4 className="font-medium">Shopping Cart</h4>
                <span className="text-sm text-muted-foreground">{cartItems.length} item(s)</span>
            </div>
            <Separator />
            <ScrollArea className="h-52 pr-4">
                <div className="flex flex-col space-y-4">
                    {cartItems.map((item) => (
                        // ======================= CHANGE 3: Add the remove button to each item row =======================
                        // Changed `items-start` to `items-center` for better vertical alignment
                        <div key={item.id} className="flex items-center space-x-3">
                            <div className="flex-1 text-sm">
                                <p className="font-semibold">{item.name}</p>
                                <p className="text-muted-foreground">
                                    {item.quantity ?? 1} x {currency(item.price * item.content)}
                                </p>
                            </div>
                            <p className="text-sm font-medium">{currency(item.price * (item.quantity ?? 1) * item.content)}</p>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-4 w-4 shrink-0 rounded-full hover:bg-neutral-50"
                                onClick={() => handleRemoveItem(item.id)}
                            >
                                <X className="h-4 w-4 text-red-600" />
                            </Button>
                        </div>
                    ))}
                </div>
            </ScrollArea>
            <Separator />
            <div className="space-y-2">
                <div className="flex justify-between font-semibold">
                    <span>Subtotal</span>
                    <span>{currency(subtotal)}</span>
                </div>
            </div>
            <Button asChild className="w-full">
                <Link href={route('cart')}>View My Cart & Checkout</Link>
            </Button>
        </div>
    );
}
