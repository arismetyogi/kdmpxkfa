import { Head, router } from '@inertiajs/react';
import pickBy from 'lodash/pickBy';
import { Package } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDebounce } from 'use-debounce';

import { CustomPagination } from '@/components/custom-pagination';
import Filters from '@/components/Filters';
import FloatingCart from '@/components/FloatingCart';
import ProductCard from '@/components/product-card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import HeaderLayout from '@/layouts/header-layout';
import { type BreadcrumbItem, type CartItem, type Paginated, type Product } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: route('dashboard') },
    { title: 'Products', href: '#' },
];

interface IndexProps {
    products: Paginated<Product>;
    allCategories: string[];
    allPackages: string[];
    filters: {
        search?: string;
        categories?: string[];
        packages?: string[];
        sort_by?: string;
    };
}

export default function OrdersIndexPage({ products, allCategories, allPackages, filters: initialFilters }: IndexProps) {
    /** -------------------- STATES -------------------- **/
    const [search, setSearch] = useState(initialFilters.search || '');
    const [sortBy, setSortBy] = useState(initialFilters.sort_by || 'name-asc');
    const [filters, setFilters] = useState({
        categories: initialFilters.categories || ['Semua Produk'],
        packages: initialFilters.packages || ['Semua Packaging'],
    });
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [animationTrigger, setAnimationTrigger] = useState(0);

    const [debouncedSearch] = useDebounce(search, 300);

    /** -------------------- MEMOS & CALLBACKS -------------------- **/
    const activeFilters = useMemo(() => {
        const { categories, packages } = filters;
        const result: Record<string, string[]> = {};

        const isNotDefault = (arr: string[], defaultValue: string) => arr.length > 1 || (arr.length === 1 && arr[0] !== defaultValue);

        if (isNotDefault(categories, 'Semua Produk')) {
            result.categories = categories.filter((c) => c !== 'Semua Produk');
        }

        if (isNotDefault(packages, 'Semua Packaging')) {
            result.packages = packages.filter((p) => p !== 'Semua Packaging');
        }

        return result;
    }, [filters]);

    const queryParams = useMemo(
        () =>
            pickBy({
                search: debouncedSearch,
                sort_by: sortBy,
                ...activeFilters,
            }),
        [debouncedSearch, sortBy, activeFilters],
    );

    /** -------------------- EFFECTS -------------------- **/
    // Trigger router update when filters or search change
    useEffect(() => {
        router.get(route('orders.products'), queryParams, {
            preserveState: true,
            replace: true,
            preserveScroll: true,
        });
    }, [queryParams]);

    // Load cart from localStorage
    useEffect(() => {
        const loadCart = () => {
            const stored = localStorage.getItem('cart');
            setCartItems(stored ? JSON.parse(stored) : []);
        };

        loadCart();
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'cart') loadCart();
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    // Update animation when cart changes
    useEffect(() => setAnimationTrigger((a) => a + 1), [cartItems]);

    const updateCartItems = useCallback(() => {
        const stored = localStorage.getItem('cart');
        setCartItems(stored ? JSON.parse(stored) : []);
    }, []);

    /** -------------------- CART FUNCTIONS -------------------- **/
    const addToCart = useCallback(
        (product: Product) => {
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

            const cart: CartItem[] = JSON.parse(localStorage.getItem('cart') || '[]');
            const existing = cart.findIndex((item) => item.sku === product.sku);

            if (existing >= 0) {
                cart[existing].quantity += 1;
            } else {
                cart.push(newItem);
            }

            localStorage.setItem('cart', JSON.stringify(cart));
            window.dispatchEvent(new Event('cart-updated'));
            updateCartItems();
        },
        [updateCartItems],
    );

    /** -------------------- UI RENDER -------------------- **/
    const productCards = useMemo(
        () =>
            products.data.map((p) => (
                <div key={p.id} className="cursor-pointer">
                    <ProductCard product={p} addToCart={addToCart} updateCartItems={updateCartItems} />
                </div>
            )),
        [products.data, addToCart, updateCartItems],
    );

    return (
        <HeaderLayout breadcrumbs={breadcrumbs}>
            <Head title="Products" />
            <h1 className="ml-6 text-2xl font-bold text-primary lg:ml-9">Medicine Catalog</h1>

            <div className="flex flex-col gap-4 p-4 lg:flex-row lg:gap-6 lg:p-6">
                {/* Sidebar Filters */}
                <div className="w-full lg:mr-4 lg:w-1/5">
                    <Filters
                        onFilterChange={setFilters}
                        categories={['Semua Produk', ...allCategories]}
                        packages={['Semua Packaging', ...allPackages]}
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

                    {products.data.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                            <Package size={64} className="mb-4 text-gray-400" />
                            <p className="text-lg font-medium">Produk yang anda cari tidak ditemukan</p>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">{productCards}</div>
                            <CustomPagination pagination={products} className="mt-6" />
                        </>
                    )}
                </div>
            </div>

            <FloatingCart key={animationTrigger} />
        </HeaderLayout>
    );
}
