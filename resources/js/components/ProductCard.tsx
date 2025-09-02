import React from "react";
import { ShoppingCart } from "lucide-react";
import { OrderProducts } from '@/types/index.js';
import { useForm } from '@inertiajs/react';

export default function ProductCard({product}: { product: OrderProducts }) {
    const { name, price, inventory, category, image, order_unit, content } = product;

    const isVitamin = category.toLowerCase().includes('vitamin');
    const isAntibiotik = category.toLowerCase().includes('antibiotik');

    const form = useForm<{productId: number, quantity: number}>({
        productId: product.id,
        quantity: 1
    });

    // 🔹 Fungsi Add to Cart
    const addToCart = () => {
        form.post(route('carts.store'), {
            preserveScroll: true,
            preserveState: true,
            onError: (err: any) => {
                console.log(err)
            },
        })
        console.log('product: ', product);
    };

    return (
        // [MODIFIKASI 1]: Tambahkan `flex flex-col` untuk membuat layout vertikal.
        // `justify-between` akan mendorong bagian atas dan bawah card menjauh.
        <div className="flex h-full flex-col justify-between rounded-lg border p-3 shadow-sm transition-colors">
            {/* Bagian Atas: Konten Produk (akan mengisi ruang yang tersedia) */}
            <div>
                <img src={image} alt={name} className="mb-2 h-32 w-full rounded-md object-cover" />

                {/* [MODIFIKASI 2]: Gunakan `items-start` agar jika nama produk wrapping,
            badge kategori tetap berada di atas. `gap-2` lebih baik untuk mobile. */}
                <div className="mb-1 flex items-start justify-between gap-2">
                    <h3 className="leading-tight font-semibold">{name}</h3>
                    <span
                        // `whitespace-nowrap` agar teks kategori tidak terpotong ke baris baru
                        className={`rounded-full px-2 py-1 text-xs whitespace-nowrap ${isVitamin ? 'bg-yellow-100 text-yellow-800' : ''} ${isAntibiotik ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}
                    >
                        {category}
                    </span>
                </div>

                <span className="block text-xs text-muted-foreground">
                    {order_unit} | {content}
                </span>

                <p className="mt-1 text-sm text-gray-500">
                    Stok:{' '}
                    {inventory > 0 ? (
                        <span className="font-semibold text-blue-600">{inventory}</span>
                    ) : (
                        <span className="font-semibold text-red-600">HABIS</span>
                    )}
                </p>
            </div>

            {/* Bagian Bawah: Harga dan Tombol (akan selalu di bawah) */}
            <div className="mt-4">
                {/* [MODIFIKASI 3]: Font size dibuat responsif. Lebih kecil di mobile, lebih besar di desktop. */}
                <p className="text-lg font-bold text-blue-600 md:text-xl">Rp {price.toLocaleString()}</p>

                {/* [MODIFIKASI 4]: Tombol dibuat `w-full` agar lebih mudah diklik di mobile
            dan memberikan tampilan yang lebih rapi. */}
                <button
                    disabled={inventory <= 0}
                    onClick={() => addToCart()}
                    className={`mt-2 flex w-full items-center justify-center gap-2 rounded px-3 py-2 font-semibold text-white transition-colors ${
                        inventory > 0 ? 'bg-blue-600 hover:bg-blue-700' : 'cursor-not-allowed bg-gray-400'
                    }`}
                >
                    <ShoppingCart size={16} /> Add to Cart
                </button>
            </div>
        </div>
    );
}
