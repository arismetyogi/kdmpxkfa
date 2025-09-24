import { Head, router } from '@inertiajs/react';
import pickBy from 'lodash/pickBy'; // Helper to remove empty values from an object
import { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce'; // A great library for debouncing input

import Filters from '@/components/Filters';
import FloatingCart from '@/components/FloatingCart';
import { CustomPagination } from '@/components/custom-pagination';
import ProductCard from '@/components/product-card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import HeaderLayout from '@/layouts/header-layout';
import { type BreadcrumbItem, CartItem, Paginated, Product } from '@/types';
import { Package } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: route('dashboard'),
    },
    {
        title: 'Medicines',
        href: '#',
    },
];

interface IndexProps {
    products: Paginated<Product>;
    allCategories: string[]; // From controller
    allPackages: string[]; // From controller
    filters: {
        // Current filters from controller
        search?: string;
        categories?: string[];
        packages?: string[];
        sort_by?: string;
    };
}

export default function OrdersIndexPage({ products, allCategories, allPackages, filters: initialFilters }: IndexProps) {
    console.log('Props received from server:', { allCategories, allPackages });
    const [search, setSearch] = useState(initialFilters.search || '');
    const [sortBy, setSortBy] = useState(initialFilters.sort_by || 'name-asc');
    const [filters, setFilters] = useState({
        categories: initialFilters.categories || ['Semua Produk'],
        packages: initialFilters.packages || ['Semua Paket'],
    });

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
            activeFilters.categories = filters.categories.filter((cat) => cat !== 'Semua Produk');
        }

        // Conditionally add packages to the request
        // Only include it if the array is not the default ["Semua Paket"]
        if (filters.packages && (filters.packages.length > 1 || (filters.packages.length === 1 && filters.packages[0] !== 'Semua Paket'))) {
            activeFilters.packages = filters.packages.filter((pack) => pack !== 'Semua Paket');
        }

        // Combine the base params with the active filters, then clean with pickBy
        // pickBy will remove keys with empty/null/undefined values (like an empty search string)
        const queryParams = pickBy({
            ...baseParams,
            ...activeFilters,
        });

        router.get(
            route('orders.products'), // Make sure you have a named route for this
            queryParams,
            {
                preserveState: true, // Prevents scroll position reset on filter change
                replace: true, // Avoids polluting browser history
                preserveScroll: true, // Keeps the scroll position
            },
        );
    }, [debouncedSearch, sortBy, filters]);

    // Cart logic
    useEffect(() => {
        const storedCart = localStorage.getItem('cart');
        if (storedCart) setCartItems(JSON.parse(storedCart));

        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'cart' && e.newValue) setCartItems(JSON.parse(e.newValue));
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const updateCartItems = () => {
        const storedCart = localStorage.getItem('cart');
        setCartItems(storedCart ? JSON.parse(storedCart) : []);
    };

    useEffect(() => {
        setAnimationTrigger((prev) => prev + 1);
    }, [cartItems]);

    const totalItems = cartItems.length;

    const addToCart = (product: Product) => {
        if (!product.is_active) return;

        const newItem: CartItem = {
            id: product.id,
            sku: product.sku,
            name: product.name,
            price: product.price,
            image: product.image,
            order_unit: product.order_unit,
            weight: product.weight,
            quantity: 1,
            content: product.content,
            base_uom: product.base_uom,
        };

        // Get current cart from localStorage
        const storedCart = localStorage.getItem('cart');
        const cart: CartItem[] = storedCart ? JSON.parse(storedCart) : [];

        // Check if item already exists in cart
        const existingItemIndex = cart.findIndex((item) => item.sku === product.sku);

        let updatedCart;
        if (existingItemIndex >= 0) {
            // Update quantity if item exists
            updatedCart = [...cart];
            updatedCart[existingItemIndex] = {
                ...updatedCart[existingItemIndex],
                quantity: updatedCart[existingItemIndex].quantity + 1,
            };
        } else {
            // Add new item to cart
            updatedCart = [...cart, newItem];
        }

        // Update localStorage
        localStorage.setItem('cart', JSON.stringify(updatedCart));

        // Notify parent component to update cart items
        updateCartItems();
    };

    return (
        <HeaderLayout breadcrumbs={breadcrumbs}>
            <Head title="Products" />
            <h1 className="ml-6 text-2xl font-bold text-primary lg:ml-9">Medicine Catalog</h1>
            <div className="flex flex-col gap-4 p-4 lg:flex-row lg:gap-6 lg:p-6">
                {/* Sidebar Filters */}
                <div className="w-full lg:mr-4 lg:w-1/5">
                    <Filters
                        onFilterChange={setFilters}
                        // Pass the full list of categories/packages from the controller
                        categories={['Semua Produk', ...allCategories]}
                        packages={['Semua Paket', ...allPackages]}
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
                                        <ProductCard product={p} addToCart={addToCart} updateCartItems={updateCartItems} />
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
        </HeaderLayout>
    );
}
