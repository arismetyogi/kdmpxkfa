import { Badge } from '@/components/ui/badge';
import { ShoppingCart } from 'lucide-react';

export default function CartWithBadge({ itemCount }: { itemCount: number }) {
    return (
        <div className="relative">
            <ShoppingCart className="h-6 w-6" />
            {itemCount > 0 && ( // Only show badge if itemCount is greater than 0
                <Badge
                    variant="destructive" // Example: Use a red badge for emphasis
                    className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full text-xs"
                >
                    {itemCount}
                </Badge>
            )}
        </div>
    );
}
