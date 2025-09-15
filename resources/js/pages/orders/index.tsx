import Filters from '@/components/Filters';
import ProductCard from '@/components/product-card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CartItem, type BreadcrumbItem, Product, Paginated, Category } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ShoppingCart } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import HeaderLayout from '@/layouts/header-layout';

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
    const [cart, setCart] = useState<CartItem[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    // 🔹 jumlah jenis produk unik
    const totalItems = cart.length;

    // 🔹 Load cart dari localStorage
    useEffect(() => {
        const storedCart = localStorage.getItem("cart");
        if (storedCart) {
            setCart(JSON.parse(storedCart));
        }
    }, []);

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
            <div className="flex flex-col gap-6 p-6 lg:flex-row">
                {/* Sidebar Filters */}
                <div className="w-full lg:w-1/4">
                    <Filters onFilterChange={setFilters} />
                </div>

                {/* Product Section */}
                <div className="flex-1">
                    <h1 className="mb-4 text-2xl font-bold text-blue-800">Medicine Catalog</h1>

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
                            <ShoppingCart size={64} className="mb-4 text-gray-400" />
                            <p className="text-lg font-medium">Produk yang anda cari tidak ditemukan</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                            {filteredProducts.map((p, i) => (
                                <div key={i}
                                     // onClick={() => setSelectedProduct(p)}
                                     className="cursor-pointer">
                                    <ProductCard product={p}/>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* 🔹 Floating Cart Button */}
            <div className="fixed right-4 bottom-4 sm:right-6 sm:bottom-6">
                <Link href={route('carts.index')} className="relative">
                    <button className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg sm:h-14 sm:w-14">
                        <ShoppingCart size={24} className="sm:size-8" />
                    </button>

                    {totalItems > 0 && (
                        <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white sm:h-6 sm:w-6">
                            {totalItems}
                        </span>
                    )}
                </Link>
            </div>

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
