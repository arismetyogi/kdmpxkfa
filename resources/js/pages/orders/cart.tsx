import HeaderLayout from "@/layouts/header-layout";
import { Head, Link } from "@inertiajs/react";
import { useState, useEffect } from "react";
import { type BreadcrumbItem, type CartItem } from "@/types";
import { ShoppingBag, ShoppingBasket } from "lucide-react";
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
    }
  }, []);

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
          <h1 className="text-2xl sm:text-3xl font-bold text-primary tracking-tight flex gap-3">
            <ShoppingBasket size={36}/>Keranjang Belanja
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
          <>
            {/* Main content grid with adjusted padding */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-32 lg:pb-0">
              {/* Daftar Pesanan */}
              <div className="lg:col-span-2 space-y-4">
                {cart.map((item, i) => (
                  <div
                    key={i}
                    className="flex flex-col sm:flex-row justify-between sm:items-center border bg-card text-card-foreground p-3 sm:p-5 rounded-xl shadow-md hover:shadow-lg transition"
                  >
                    {/* Info Produk */}
                    <div className="flex items-center gap-4 sm:gap-5">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover shadow"
                      />
                      <div>
                        <h2 className="font-semibold text-base sm:text-lg">{item.name}</h2>
                        <p className="text-sm text-muted-foreground">
                          {item.weight} gram / {item.order_unit}
                        </p>
                        <p className="text-primary font-bold text-sm sm:text-base mt-1">
                          Rp {(item.price ?? 0).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {/* Quantity & Actions */}
                    <div className="flex items-center gap-3 mt-4 sm:mt-0">
                      <button
                        onClick={() => updateQuantity(item.sku, -1)}
                        className="px-3 py-1.5 bg-primary-foreground rounded-4xl hover:bg-primary/80 transition font-bold border-1"
                      >
                        -
                      </button>
                      <span className="font-semibold text-lg text-primary">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.sku, 1)}
                        className="px-3 py-1.5 bg-primary-foreground rounded-4xl hover:bg-primary/80 transition font-bold border-1"
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

              {/* Ringkasan Belanja (Desktop View) */}
              <div className="hidden lg:block border bg-card text-card-foreground rounded-2xl p-6 shadow-lg lg:sticky lg:top-20 self-start">
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
                  <div className="flex justify-between border-t pt-3 mt-3 text-lg sm:text-xl font-bold text-primary">
                    <span>Total</span>
                    <span>Rp {grandTotal.toLocaleString()}</span>
                  </div>
                </div>
                <div className="mt-8">
                  <Link href={route("checkout")} >
                    <button 
                      className="bg-blue-600 text-primary-foreground px-6 py-3 rounded-xl hover:bg-blue-600/90 transition w-full font-semibold shadow-md"
                    >
                      Cetak Purchase Order
                    </button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Redesigned Mobile Sticky Footer */}
            {cart.length > 0 && (
                <div className="block lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t shadow-[0_-4px_10px_-1px_rgba(0,0,0,0.05)] pt-2 pb-3 px-4">
                <div className="flex flex-col items-center gap-2 max-w-screen-xl mx-auto">
                  {/* Total Information */}
                  <div className="text-center">
                    <span className="text-xs text-muted-foreground">Total Belanja</span>
                    <p className="text-lg font-bold text-primary">
                      Rp {grandTotal.toLocaleString()}
                    </p>
                  </div>
                  
                  {/* Checkout Button */}
                  <Link href={route("checkout")} className="w-full max-w-sm">
                    <button 
                      className="bg-blue-600 text-primary-foreground px-4 py-3 rounded-xl hover:bg-blue-600/90 transition w-full font-semibold shadow-md text-sm"
                    >
                      Cetak Purchase Order
                    </button>
                  </Link>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </HeaderLayout>
  );
}