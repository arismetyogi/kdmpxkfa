import { Icon } from '@/components/icon';
import { useCart } from '@/context/CartContext';
import { ShoppingCart } from 'lucide-react';
import { useRef, useState } from 'react';
import { CartPopoverContent } from './cart-popover-content';
import { Button } from './ui/button';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

/**
 * A self-contained Popover component that displays the shopping cart.
 * It opens on both hover and click for a flexible user experience.
 */
export function CartPopover() {
    const { cartCount } = useCart();

    // State to control the visibility of the popover
    const [isOpen, setIsOpen] = useState(false);

    // ======================= CHANGE 1: Add a state to "lock" the popover open on click =======================
    const [isLockedOpen, setIsLockedOpen] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    // This handler synchronizes our state when shadcn's Popover closes itself
    // (e.g., by clicking outside or pressing Escape).
    const handleOpenChange = (open: boolean) => {
        setIsOpen(open);
        // If the popover is being closed, always remove the lock.
        if (!open) {
            setIsLockedOpen(false);
        }
    };

    const handleMouseEnter = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        setIsOpen(true);
    };

    // ======================= CHANGE 2: The mouse leave handler now respects the lock =======================
    const handleMouseLeave = () => {
        // Only close the popover on mouse leave if it's NOT locked by a click.
        if (!isLockedOpen) {
            timeoutRef.current = setTimeout(() => {
                setIsOpen(false);
            }, 500);
        }
    };

    // ======================= CHANGE 3: The click handler toggles the locked state =======================
    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent any default button behavior that might interfere
        const newLockedState = !isLockedOpen;
        setIsLockedOpen(newLockedState);
        // Ensure the popover is open when we lock it.
        // It will also close the popover if it was already locked.
        setIsOpen(newLockedState);
    };

    return (
        <Popover open={isOpen} onOpenChange={handleOpenChange}>
            <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                <PopoverTrigger asChild onClick={handleClick}>
                    <Button variant="ghost" size="icon" className="group relative ml-1 h-9 w-9">
                        <span className="sr-only">Cart</span>
                        <Icon iconNode={ShoppingCart} className="size-5 text-foreground opacity-80 group-hover:opacity-100" />
                        {cartCount > 0 && (
                            // Fixed the span to actually show the cart count
                            <span className="absolute -top-0.25 -right-0.25 flex h-3 w-3 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white"></span>
                        )}
                    </Button>
                </PopoverTrigger>

                <PopoverContent className="w-96" align="end" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                    <CartPopoverContent />
                </PopoverContent>
            </div>
        </Popover>
    );
}
