import React from "react";
import { ShoppingCart } from "lucide-react";

export default function ProductCard({ product, addToCart }) {
  const { name, price, stock, category, image, packaging, qty } = product;

  const isVitamin = category.toLowerCase().includes("vitamin");
  const isAntibiotik = category.toLowerCase().includes("antibiotik");

  return (
    // [MODIFIKASI 1]: Tambahkan `flex flex-col` untuk membuat layout vertikal.
    // `justify-between` akan mendorong bagian atas dan bawah card menjauh.
    <div className="border rounded-lg p-3 shadow-sm transition-colors flex flex-col justify-between h-full">
      
      {/* Bagian Atas: Konten Produk (akan mengisi ruang yang tersedia) */}
      <div>
        <img
          src={image}
          alt={name}
          className="w-full h-32 object-cover rounded-md mb-2"
        />
        
        {/* [MODIFIKASI 2]: Gunakan `items-start` agar jika nama produk wrapping, 
            badge kategori tetap berada di atas. `gap-2` lebih baik untuk mobile. */}
        <div className="flex justify-between items-start gap-2 mb-1">
          <h3 className="font-semibold leading-tight">{name}</h3>
          <span
            // `whitespace-nowrap` agar teks kategori tidak terpotong ke baris baru
            className={`text-xs px-2 py-1 rounded-full whitespace-nowrap
              ${isVitamin ? "bg-yellow-100 text-yellow-800" : ""}
              ${isAntibiotik ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}`}
          >
            {category}
          </span>
        </div>

        <span className="text-xs text-muted-foreground block">
          {packaging} | {qty}
        </span>

        <p className="text-sm text-gray-500 mt-1">
          Stok:{" "}
          {stock > 0 ? (
            <span className="font-semibold text-blue-600">{stock}</span>
          ) : (
            <span className="font-semibold text-red-600">HABIS</span>
          )}
        </p>
      </div>

      {/* Bagian Bawah: Harga dan Tombol (akan selalu di bawah) */}
      <div className="mt-4">
        {/* [MODIFIKASI 3]: Font size dibuat responsif. Lebih kecil di mobile, lebih besar di desktop. */}
        <p className="text-lg md:text-xl font-bold text-blue-600">
          Rp {price.toLocaleString()}
        </p>

        {/* [MODIFIKASI 4]: Tombol dibuat `w-full` agar lebih mudah diklik di mobile
            dan memberikan tampilan yang lebih rapi. */}
        <button
          disabled={stock <= 0}
          onClick={() => addToCart(product)}
          className={`w-full flex items-center justify-center gap-2 mt-2 px-3 py-2 rounded text-white font-semibold transition-colors ${
            stock > 0
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          <ShoppingCart size={16} /> Add to Cart
        </button>
      </div>
    </div>
  );
}