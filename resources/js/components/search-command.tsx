'use client';

import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useDebounce } from '@/hooks/use-debounce';
import { currency } from '@/lib/utils';
import type { Product } from '@/types';
import { router } from '@inertiajs/react';
import axios from 'axios';
import { FileSearch } from 'lucide-react';
import * as React from 'react';

// The component now accepts `children` to be used as the trigger
interface SearchCommandProps {
    children: React.ReactNode;
}

export default function SearchCommand({ children }: SearchCommandProps) {
    const [open, setOpen] = React.useState(false); // Manages its own open state
    const [query, setQuery] = React.useState('');
    const [results, setResults] = React.useState<Product[]>([]);
    const [loading, setLoading] = React.useState(false);
    const debouncedQuery = useDebounce(query, 300);

    // --- Fetch products using axios (this logic remains unchanged) ---
    React.useEffect(() => {
        if (!debouncedQuery.trim()) {
            setResults([]);
            return;
        }

        let isMounted = true;

        const fetchProducts = async () => {
            setLoading(true);
            try {
                const response = await axios.get('/api/products/search', {
                    params: { q: debouncedQuery },
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                    },
                });

                if (isMounted) setResults(response.data);
            } catch (error) {
                console.error('Error fetching search results:', error);
                if (isMounted) setResults([]);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchProducts();
        return () => {
            isMounted = false;
        };
    }, [debouncedQuery]);

    // Handle select now also closes the popover
    const handleSelect = (productId: number) => {
        setOpen(false); // Close popover
        setQuery(''); // Reset input
        router.visit(`/orders/products/${productId}`); // Navigate to product page
    };

    // Reset results when popover closes
    React.useEffect(() => {
        if (!open) {
            setQuery('');
            setResults([]);
        }
    }, [open]);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>{children}</PopoverTrigger>

            {/* The content is the command menu */}
            <PopoverContent className="w-[400px] p-0" align="end">
                <Command>
                    <CommandInput placeholder="Cari produk berdasarkan nama atau SKU..." value={query} onValueChange={setQuery} />

                    <CommandList>
                        {loading && <div className="p-4 text-center text-sm text-muted-foreground">Mencari...</div>}

                        {!loading && debouncedQuery.trim() && results.length === 0 && (
                            <CommandEmpty>
                                <div className="flex flex-col items-center justify-center gap-2 py-6">
                                    <FileSearch className="h-8 w-8 text-muted-foreground" />
                                    <p className="text-sm text-muted-foreground">
                                        Tidak ada produk ditemukan untuk <span className="font-semibold">"{debouncedQuery}"</span>
                                    </p>
                                </div>
                            </CommandEmpty>
                        )}

                        {!loading && results.length > 0 && (
                            <CommandGroup heading="Produk">
                                {results.map((product) => (
                                    <CommandItem key={product.id} value={`${product.name} ${product.sku}`} onSelect={() => handleSelect(product.id)}>
                                        <div className="flex w-full items-center gap-3">
                                            {/* Product Image */}
                                            {product.image && Object.keys(product.image).length > 0 ? (
                                                <img
                                                    src={Object.values(product.image)[0] as string}
                                                    alt={product.name}
                                                    className="h-10 w-10 rounded-md object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-gray-200">
                                                    <span className="text-xs text-gray-500">No Image</span>
                                                </div>
                                            )}

                                            {/* Product Info */}
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center justify-between">
                                                    <div className="truncate font-medium">{product.name}</div>
                                                    <div className="ml-2 font-medium">{currency(product.price * product.content)}</div>
                                                </div>
                                                <div className="flex items-center justify-between text-xs leading-tight text-muted-foreground">
                                                    <span className="truncate">{product.category?.subcategory1 || 'Uncategorized'}</span>
                                                    <span className="truncate">per {product.order_unit}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        )}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
