'use client';

import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { useDebounce } from '@/hooks/use-debounce';
import { router } from '@inertiajs/react'; // gunakan router dari Inertia
import axios from 'axios';
import { FileSearch } from 'lucide-react';
import * as React from 'react';

interface Product {
    id: number;
    name: string;
    sku: string;
    slug: string;
}

interface SearchCommandProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function SearchCommand({ open, onOpenChange }: SearchCommandProps) {
    const [query, setQuery] = React.useState('');
    const [results, setResults] = React.useState<Product[]>([]);
    const [loading, setLoading] = React.useState(false);
    const debouncedQuery = useDebounce(query, 300);

    // --- Fetch products using axios ---
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

    // ✅ Handle select now also navigates via Inertia router
    const handleSelect = (productId: number) => {
        onOpenChange(false); // Close dialog
        setQuery(''); // Reset input
        router.visit(`/orders/products/${productId}`); // Navigate to product page
    };

    return (
        <CommandDialog open={open} onOpenChange={onOpenChange}>
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
                                <div className="flex w-full justify-between">
                                    <span>{product.name}</span>
                                    <span className="text-xs text-muted-foreground">{product.sku}</span>
                                </div>
                            </CommandItem>
                        ))}
                    </CommandGroup>
                )}
            </CommandList>
        </CommandDialog>
    );
}
