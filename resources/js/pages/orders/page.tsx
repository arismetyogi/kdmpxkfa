import Filters from '@/components/Filters';
import ProductCard from '@/components/ProductCard';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CartItem, type BreadcrumbItem, OrderProducts } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ShoppingCart } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppHeaderLayout from '@/layouts/app/app-header-layout';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Products',
        href: '/orders/products',
    },
];

export default function IndexPage() {
    const products: OrderProducts[] = [
        {
            name: 'KF FACIAL TISSUE 200S ANIMAL',
            price: 15000,
            inventory: 20,
            category: 'Barang',
            order_unit: 'PCS',
            content: 1,
            base_uom: 'PCS',
            image: 'https://placehold.co/400',
            description: 'Tisu wajah isi besar, lembut dan aman untuk kulit wajah sehari-hari..',
        },
        {
            name: 'FITUNO TAB SALUT (BLISTER 3X10 TAB)-BJN',
            price: 10000,
            inventory: 20,
            category: 'Obat',
            order_unit: 'BLT',
            content: 1,
            base_uom: 'TAB',
            image: 'https://placehold.co/400',
            description: 'Suplemen herbal untuk bantu tingkatkan daya tahan tubuh dan pemulihan stamina.',
        },
        {
            name: 'sample syrup',
            price: 15000,
            inventory: 0,
            category: 'Antibiotik',
            order_unit: 'BTL',
            content: 1,
            base_uom: 'BTL',
            image: 'https://placehold.co/400',
            description: '',
        },
        {
            name: 'ENKASARI HERBAL 120ML',
            price: 25000,
            inventory: 20,
            category: 'Obat',
            order_unit: 'BTL',
            content: 1,
            base_uom: 'BTL',
            image: 'https://placehold.co/400',
            description:
                'Cairan kumur herbal alami untuk menjaga kesehatan mulut dan tenggorokan. Formulanya membantu mengatasi bau mulut, sariawan, dan meredakan radang tenggorokan. Dengan bahan-bahan pilihan, memberikan sensasi segar dan nyaman setelah digunakan. Ideal untuk kebersihan mulut sehari-hari.',
        },
        {
            name: 'MAGASIDA TABLET (DUS 10 TAB)-BJN',
            price: 20000,
            inventory: 20,
            category: 'Obat',
            order_unit: 'STR',
            content: 10,
            base_uom: 'TAB',
            image: 'https://placehold.co/400',
            description:
                'Obat yang digunakan untuk mengatasi gangguan pada saluran pencernaan seperti gastritis, perut kembung, maag, dispepsia, hiatus hernia, tukak lambung dan tukak usus duabelas jari',
        },
        {
            name: 'BATUGIN ELIXIR BT 120 ML - BJN',
            price: 65000,
            inventory: 20,
            category: 'Obat',
            order_unit: 'BTL',
            content: 1,
            base_uom: 'Syrup',
            image: 'https://placehold.co/400',
            description: 'Obat herbal pereda batu ginjal, sirup 120ml dari BJN',
        },
    ];

    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState('name-asc');
    const [filters, setFilters] = useState({ categories: ['Semua Produk'], packages: ['Semua Package'] });
    const [cart, setCart] = useState<CartItem[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<OrderProducts | null>(null); // 🔹 modal state

    // 🔹 Hitung total unique item dalam cart
    const totalItems = cart.length;

    // 🔹 Load cart dari localStorage saat pertama kali render
    useEffect(() => {
        const storedCart = localStorage.getItem('cart');
        if (storedCart) {
            setCart(JSON.parse(storedCart));
        }
    }, []);

    // 🔹 Fungsi Add to Cart
    const addToCart = (product: Omit<CartItem, 'quantity'>) => {
        setCart((prevCart) => {
            const existing = prevCart.find((item) => item.name === product.name);
            let newCart;
            if (existing) {
                newCart = prevCart.map((item) => (item.name === product.name ? { ...item, quantity: item.quantity + 1 } : item));
            } else {
                newCart = [...prevCart, { ...product, quantity: 1 }];
            }

            // Simpan ke localStorage
            localStorage.setItem('cart', JSON.stringify(newCart));
            return newCart;
        });
    };

    // 🔹 filter berdasarkan search
    let filteredProducts = products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

    // ambil filter aktif (tanpa "Semua")
    const activeCategories = filters.categories.filter((c) => c !== 'Semua Produk');
    const activePackages = filters.packages.filter((p) => p !== 'Semua Package');

    // 🔹 filter kategori & package
    if (!(activeCategories.length === 0 && activePackages.length === 0)) {
        filteredProducts = filteredProducts.filter((p) => {
            const matchCategory = activeCategories.length === 0 || activeCategories.includes(p.category);

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
        <AppHeaderLayout breadcrumbs={breadcrumbs}>
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
                                <div key={i} onClick={() => setSelectedProduct(p)} className="cursor-pointer">
                                    <ProductCard product={p} addToCart={addToCart} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* 🔹 Floating Cart Button */}
            <div className="fixed right-4 bottom-4 sm:right-6 sm:bottom-6">
                <Link href={route('orders.cart')} className="relative">
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
                                        <strong>Stok:</strong> {selectedProduct.inventory > 0 ? selectedProduct.inventory : 'Habis'}
                                    </p>
                                    <p>
                                        <strong>Kategori:</strong> {selectedProduct.category}
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
                                    {/*    'Belum ada informasi benefit.'*/}
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
        </AppHeaderLayout>
    );
}
