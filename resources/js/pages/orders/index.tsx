import { useEffect, useState, useCallback } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import { useDebounce } from 'use-debounce'; // A great library for debouncing input
import pickBy from 'lodash/pickBy'; // Helper to remove empty values from an object

import Filters from '@/components/Filters';
import ProductCard from '@/components/product-card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Package } from 'lucide-react';
import HeaderLayout from '@/layouts/header-layout';
import FloatingCart from '@/components/FloatingCart';
import { CustomPagination } from '@/components/custom-pagination';
import { type BreadcrumbItem, Product, Paginated, Category, CartItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Products',
        href: '/orders/products',
    },
];

interface IndexProps {
    products: Paginated<Product>;
    allCategories: string[]; // From controller
    allPackages: string[];   // From controller
    filters: { // Current filters from controller
        search?: string;
        categories?: string[];
        packages?: string[];
        sort_by?: string;
    };
}

export default function OrdersIndexPage({ products, allCategories, allPackages, filters: initialFilters }: IndexProps) {
    console.log("Props received from server:", { allCategories, allPackages });
    const [search, setSearch] = useState(initialFilters.search || "");
    const [sortBy, setSortBy] = useState(initialFilters.sort_by || "name-asc");
    const [filters, setFilters] = useState({ 
        categories: initialFilters.categories || ["Semua Produk"], 
        packages: initialFilters.packages || ["Semua Paket"] 
    });
    
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [animationTrigger, setAnimationTrigger] = useState(0);

    const [debouncedSearch] = useDebounce(search, 300); // Debounce search input

    // This effect listens for changes in filters and triggers a new Inertia request
    useEffect(() => {
        // Start with the base parameters that are always present (even if empty)
        const baseParams = { 
            search: debouncedSearch, 
            sort_by: sortBy,

        };

                // ====================== THE FIX IS HERE ======================
        // Create a copy of the filters to potentially add to the parameters
        const activeFilters = {};

        // Conditionally add categories to the request
        // Only include it if the array is not the default ["Semua Produk"]
        if (filters.categories && (filters.categories.length > 1 || (filters.categories.length === 1 && filters.categories[0] !== 'Semua Produk'))) {
            activeFilters.categories = filters.categories.filter(cat => cat !== 'Semua Produk');
        }

        // Conditionally add packages to the request
        // Only include it if the array is not the default ["Semua Paket"]
        if (filters.packages && (filters.packages.length > 1 || (filters.packages.length === 1 && filters.packages[0] !== 'Semua Paket'))) {
            activeFilters.packages = filters.packages.filter(pack => pack !== 'Semua Paket');
        }

        // Combine the base params with the active filters, then clean with pickBy
        // pickBy will remove keys with empty/null/undefined values (like an empty search string)
        const queryParams = pickBy({
            ...baseParams,
            ...activeFilters
        });

        router.get(
            route('orders.products'), // Make sure you have a named route for this
            queryParams,
            {
                preserveState: true, // Prevents scroll position reset on filter change
                replace: true,       // Avoids polluting browser history
                preserveScroll: true, // Keeps the scroll position
            }
        );
    }, [debouncedSearch, sortBy, filters]);


    // Cart logic
    useEffect(() => {
        const storedCart = localStorage.getItem("cart");
        if (storedCart) setCartItems(JSON.parse(storedCart));

        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === "cart" && e.newValue) setCartItems(JSON.parse(e.newValue));
        };

        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    const updateCartItems = () => {
        const storedCart = localStorage.getItem("cart");
        setCartItems(storedCart ? JSON.parse(storedCart) : []);
    };
    
    useEffect(() => {
        setAnimationTrigger(prev => prev + 1);
    }, [cartItems]);

    const totalItems = cartItems.length;


    return (
        <HeaderLayout breadcrumbs={breadcrumbs}>
            <Head title="Products" />
            <h1 className="text-2xl font-bold pt-4 px-4 lg:pt-6 lg:ml-9 text-blue-800">Medicine Catalog</h1>
            <div className="flex flex-col gap-4 p-4 lg:gap-6 lg:p-6 lg:flex-row">
                {/* Sidebar Filters */}
                <div className="w-full lg:block lg:w-1/4">
                    <Filters 
                        onFilterChange={setFilters} 
                        // Pass the full list of categories/packages from the controller
                        categories={["Semua Produk", ...allCategories]}
                        packages={["Semua Paket", ...allPackages]}
                        // Pass the currently active filters to the component
                        activeFilters={filters}
                    />
                </div>

                {/* Product Section */}
                <div className="flex-1">
                    <div className="mb-4 flex flex-col justify-between gap-2 sm:flex-row">
                        <input
                            type="text"
                            placeholder="Search Products..."
                            className="w-full rounded-md border px-3 py-2"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />

                        <Select value={sortBy} onValueChange={setSortBy}>
                            <SelectTrigger className="w-[200px]">
                                <SelectValue placeholder="Sort Products" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="name-asc">A → Z</SelectItem>
                                <SelectItem value="name-desc">Z → A</SelectItem>
                                <SelectItem value="lowest">Lowest Price</SelectItem>
                                <SelectItem value="highest">Highest Price</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Produk */}
                    {products.data.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                            <Package size={64} className="mb-4 text-gray-400" />
                            <p className="text-lg font-medium">Produk yang anda cari tidak ditemukan</p>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                                {products.data.map((p) => (
                                    <div key={p.id} className="cursor-pointer">
                                        <ProductCard product={p} updateCartItems={updateCartItems} />
                                    </div>
                                ))}
                            </div>
                            {/* Add Custom Pagination */}
                            <CustomPagination pagination={products} className="mt-6" />
                        </>
                    )}
                </div>
            </div>

            {/* Floating Cart */}
            <FloatingCart totalItems={totalItems} animationTrigger={animationTrigger} />

            {/* 🔹 Modal Detail Produk */}
            <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
                <DialogContent className="max-h-[90vh] w-[95%] overflow-y-auto sm:max-w-lg md:max-w-2xl">
                    {selectedProduct && (
                        <>
                            <DialogHeader>
                                <DialogTitle>{selectedProduct.name}</DialogTitle>
                                <DialogDescription>{selectedProduct.description || 'Tidak ada deskripsi tersedia.'}</DialogDescription>
                            </DialogHeader>

                            <div className="flex flex-col gap-4 sm:flex-row">
                                <img
                                    src={selectedProduct.image}
                                    alt={selectedProduct.name}
                                    className="w-full rounded-lg border object-cover sm:w-1/3"
                                />
                                <div className="flex-1 space-y-2">
                                    <p>
                                        <strong>Harga:</strong> Rp{selectedProduct.price.toLocaleString()}
                                    </p>
                                    <p>
                                        <strong>Kategori:</strong> {selectedProduct.category?.subcategory2}
                                    </p>
                                    <p>
                                        <strong>Kemasan:</strong> {selectedProduct.order_unit}
                                    </p>
                                    <p>
                                        <strong>Kuantitas:</strong> {selectedProduct.content}
                                    </p>
                                </div>
                            </div>

                            {/* 🔹 Tabs untuk Benefit & Dosage */}
                            <Tabs defaultValue="benefit" className="mt-4">
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="benefit">Benefit</TabsTrigger>
                                    <TabsTrigger value="dosage">Dosage</TabsTrigger>
                                </TabsList>

                                <TabsContent value="benefit" className="mt-2 text-sm text-gray-700">
                                    {/*{selectedProduct.benefit && selectedProduct.benefit.length > 0 ? (*/}
                                    {/*    <ul className="list-disc space-y-1 pl-5">*/}
                                    {/*        {selectedProduct.benefit.map((item: string, idx: number) => (*/}
                                    {/*            <li key={idx}>{item}</li>*/}
                                    {/*        ))}*/}
                                    {/*    </ul>*/}
                                    {/*) : (*/}
                                        'Belum ada informasi benefit.'
                                    {/*)}*/}
                                </TabsContent>

                                <TabsContent value="dosage" className="mt-2 text-sm text-gray-700">
                                    <div className="space-y-1">
                                        {/*{selectedProduct.dosage.split('. ').map((line: string, idx: number) => {*/}
                                        {/*    const formatted = line*/}
                                        {/*        .replace(/Dewasa:/g, '<strong>Dewasa:</strong>')*/}
                                        {/*        .replace(/Anak-anak:/g, '<strong>Anak-anak:</strong>');*/}
                                        {/*    return (*/}
                                        {/*        <p*/}
                                        {/*            key={idx}*/}
                                        {/*            dangerouslySetInnerHTML={{*/}
                                        {/*                __html: formatted + (line.endsWith('.') ? '' : '.'),*/}
                                        {/*            }}*/}
                                        {/*        />*/}
                                        {/*    );*/}
                                        {/*})}*/}
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </HeaderLayout>
    );
}
