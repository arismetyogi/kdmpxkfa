import HeaderLayout from "@/layouts/header-layout";
import { Head, Link } from "@inertiajs/react";
import { useState, useEffect } from "react";
import { type BreadcrumbItem, type CartItem } from "@/types";
import { ShoppingBag } from "lucide-react";
import { toast } from "sonner";

const breadcrumbs: BreadcrumbItem[] = [
  { title: "Dashboard", href: "/dashboard" },
  { title: "Medicines", href: "/orders/products" },
  { title: "Cart", href: "#" },
];

export default function Cart() {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) setCart(JSON.parse(storedCart));
  
  const message = localStorage.getItem("cartmsg")
   if (message){
    toast.error(message)
    localStorage.removeItem("cartmsg")
   }}, []);

  const updateQuantity = (sku: string, delta: number) => {
    const updated = cart
      .map((item) =>
        item.sku === sku
          ? {
              ...item,
              quantity: Math.max(0, item.quantity + delta),
              total: Math.max(0, item.quantity + delta) * Number(item.price),
            }
          : item
      )
      .filter((item) => item.quantity > 0);

    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const removeItem = (sku: string) => {
    const updated = cart.filter((item) => item.sku !== sku);
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const ppn = subtotal * 0.11;
  const grandTotal = subtotal + ppn;

  return (
    <HeaderLayout breadcrumbs={breadcrumbs}>
      <Head title="Cart" />
      <div className="p-4 sm:p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-blue-600 tracking-tight">
            🛒 Keranjang Belanja
          </h1>
          {cart.length > 0 && (
            <button
              onClick={clearCart}
              className="px-4 py-2 text-destructive hover:bg-destructive/10 rounded-lg transition text-sm sm:text-base"
            >
              Hapus Semua
            </button>
          )}
        </div>

        {/* Empty State */}
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-72 text-muted-foreground text-center px-4 rounded-2xl">
            <ShoppingBag size={80} className="mb-6 opacity-50" />
            <p className="text-lg sm:text-xl font-semibold mb-4">
              Keranjang masih kosong
            </p>
            <Link href={route("orders.products")} className="w-full max-w-xs">
              <button className="bg-blue-600 text-primary-foreground px-6 py-3 rounded-xl hover:bg-blue-600/90 transition w-full font-medium shadow-md">
                Mulai Belanja
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Daftar Pesanan */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item, i) => (
                <div
                  key={i}
                  className="flex flex-col sm:flex-row justify-between sm:items-center border bg-card text-card-foreground p-5 rounded-xl shadow-md hover:shadow-lg transition"
                >
                  {/* Info Produk */}
                  <div className="flex items-center gap-5">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 rounded-lg object-cover shadow"
                    />
                    <div>
                      {/* Text now inherits from `text-card-foreground` */}
                      <h2 className="font-semibold text-lg">
                        {item.name}
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        {item.weight} gram / {item.order_unit}
                      </p>
                      <p className="text-blue-600 font-bold text-base mt-1">
                        Rp {(item.price ?? 0).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Quantity & Actions */}
                  <div className="flex items-center gap-3 mt-4 sm:mt-0">
                    {/* --- THEME CHANGE #6: Use secondary colors for interactive elements --- */}
                    <button
                      onClick={() => updateQuantity(item.sku, -1)}
                      className="px-3 py-1.5 bg-secondary rounded-lg hover:bg-secondary/80 transition font-bold"
                    >
                      -
                    </button>
                    <span className="font-semibold text-lg">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.sku, 1)}
                      className="px-3 py-1.5 bg-secondary rounded-lg hover:bg-secondary/80 transition font-bold"
                    >
                      +
                    </button>
                    <button
                      onClick={() => removeItem(item.sku)}
                      className="ml-3 text-destructive hover:text-destructive/80 text-sm sm:text-base"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Ringkasan Belanja */}
            <div className="border bg-card text-card-foreground rounded-2xl p-6 shadow-lg lg:sticky lg:top-20 self-start">
              <h2 className="font-bold text-xl mb-5">
                Ringkasan Belanja
              </h2>
              <div className="space-y-3 text-sm sm:text-base">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>Rp {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>PPN (11%)</span>
                  <span>Rp {ppn.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-t pt-3 mt-3 text-lg sm:text-xl font-bold text-blue-600">
                  <span>Total</span>
                  <span>Rp {grandTotal.toLocaleString()}</span>
                </div>
              </div>

              <div className="mt-8">
                <Link href={route("checkout")} >
                {/* --- THEME CHANGE #11: Use primary colors for the checkout button, removing gradient for better theming --- */}
                <button 
                  className="bg-blue-600 text-primary-foreground px-6 py-3 rounded-xl hover:bg-blue-600/90 transition w-full font-semibold shadow-md"
                >
                  Cetak Purchase Order
                </button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </HeaderLayout>
  );
}