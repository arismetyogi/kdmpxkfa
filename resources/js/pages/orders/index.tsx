import Filters from '@/components/Filters';
import ProductCard from '@/components/ProductCard';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { type BreadcrumbItem, Product, Paginated, Category } from '@/types';
import { Head } from '@inertiajs/react';
import { Package } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppHeaderLayout from '@/layouts/app/app-header-layout';
import FloatingCart from '@/components/FloatingCart';
import { CartItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Products',
        href: '/orders/products',
    },
];

interface IndexProps {
    products: Paginated<Product>;
    categories: Category[];
}
export default function OrdersIndexPage({ products, categories }: IndexProps) {
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState("name-asc");
    const [filters, setFilters] = useState({ categories: ["Semua Produk"], packages: ["Semua Paket"] });
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [animationTrigger, setAnimationTrigger] = useState(0);

    // Extract unique categories and packages from products
    const uniqueCategories = ["Semua Produk", ...new Set(products.data.map(p => p.category?.main_category).filter(Boolean))] as string[];
    const uniquePackages = ["Semua Paket", ...new Set(products.data.map(p => p.order_unit).filter(Boolean))] as string[];

    // Load cart items from localStorage
    useEffect(() => {
        const storedCart = localStorage.getItem("cart");
        if (storedCart) {
            setCartItems(JSON.parse(storedCart));
        }

        // Listen for storage changes from other tabs/components
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === "cart") {
                if (e.newValue) {
                    setCartItems(JSON.parse(e.newValue));
                } else {
                    setCartItems([]);
                }
            }
        };

        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    // Update cart items when localStorage changes
    const updateCartItems = () => {
        const storedCart = localStorage.getItem("cart");
        if (storedCart) {
            setCartItems(JSON.parse(storedCart));
        } else {
            setCartItems([]);
        }
    };

    // Calculate total items in cart
    const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

    // Handle animation when cart is updated
    useEffect(() => {
        setAnimationTrigger(prev => prev + 1);
    }, [cartItems]);

    // 🔹 filter berdasarkan search
    let filteredProducts = products.data.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

    // ambil filter aktif (tanpa "Semua")
    const activeCategories = filters.categories.filter((c) => c !== 'Semua Produk');
    const activePackages = filters.packages.filter((p) => p !== 'Semua Paket');

    // 🔹 filter kategori & package
    if (!(activeCategories.length === 0 && activePackages.length === 0)) {
        filteredProducts = filteredProducts.filter((p) => {
            const matchCategory = activeCategories.length === 0 || activeCategories.includes(p.category?.main_category as string);

            const matchPackage = activePackages.length === 0 || activePackages.includes(p.order_unit);

            return matchCategory && matchPackage;
        });
    }

    // 🔹 sorting
    if (sortBy === 'lowest') {
        filteredProducts = [...filteredProducts].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'highest') {
        filteredProducts = [...filteredProducts].sort((a, b) => b.price - a.price);
    } else if (sortBy === 'name-asc') {
        filteredProducts = [...filteredProducts].sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'name-desc') {
        filteredProducts = [...filteredProducts].sort((a, b) => b.name.localeCompare(a.name));
    }

    return (
        <HeaderLayout breadcrumbs={breadcrumbs}>
            <Head title="Products" />
            <h1 className="text-2xl font-bold pt-6 ml-6 lg:ml-9  text-blue-800">Medicine Catalog</h1>
            <div className="flex flex-col gap-6 p-6 lg:flex-row">
                {/* Sidebar Filters */}
                <div className="w-full lg:w-1/4">
                    <Filters 
                        onFilterChange={setFilters} 
                        categories={uniqueCategories}
                        packages={uniquePackages}
                    />
                </div>

                {/* Product Section */}
                <div className="flex-1">
                    

                    <div className="mb-4 flex flex-col justify-between gap-2 sm:flex-row">
                        <input
                            type="text"
                            placeholder="Search Products..."
                            className="w-full rounded-md border px-3 py-2 sm:w-1/2"
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
                    {filteredProducts.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                            <Package size={64} className="mb-4 text-gray-400" />
                            <p className="text-lg font-medium">Produk yang anda cari tidak ditemukan</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                            {filteredProducts.map((p, i) => (
                                <div key={i}
                                     // onClick={() => setSelectedProduct(p)}
                                     className="cursor-pointer">
                                    <ProductCard product={p} updateCartItems={updateCartItems} />
                                </div>
                            ))}
                        </div>
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
