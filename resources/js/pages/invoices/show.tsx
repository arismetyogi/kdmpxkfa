import React from "react";
import { PageProps } from "@inertiajs/core";

interface User {
  id: number;
  name: string;
  email: string;
}

interface Category {
  id: number;
  name: string;
}

interface Product {
  id: number;
  name: string;
  sku: string;
  price: number;
  category?: Category;
}

interface OrderItem {
  id: number;
  quantity: number;
  product: Product;
}

interface Order {
  id: number;
  transaction_number: string;
  user: User;
  order_items: OrderItem[];
}

interface Invoice {
  id: number;
  invoice_number: string;
  invoice_date: string;
  subtotal: string;
  tax: string;
  total: string;
  order: Order;
}

interface Props extends PageProps {
  invoice: Invoice;
}

const Show: React.FC<Props> = ({ invoice }) => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">
        Invoice #{invoice.invoice_number}
      </h1>

      <div className="mb-6">
        <p>
          <strong>Tanggal:</strong>{" "}
          {new Date(invoice.invoice_date).toLocaleDateString("id-ID")}
        </p>
        <p>
          <strong>Customer:</strong> {invoice.order.user.name} (
          {invoice.order.user.email})
        </p>
        <p>
          <strong>Transaksi:</strong> {invoice.order.transaction_number}
        </p>
      </div>

      <table className="w-full border-collapse border border-gray-300 mb-6">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2 text-left">Produk</th>
            <th className="border p-2 text-left">Kategori</th>
            <th className="border p-2 text-center">Qty</th>
            <th className="border p-2 text-right">Harga</th>
            <th className="border p-2 text-right">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {invoice.order.order_items.map((item) => (
            <tr key={item.id}>
              <td className="border p-2">{item.product.name}</td>
              <td className="border p-2">
                {item.product.category?.name ?? "-"}
              </td>
              <td className="border p-2 text-center">{item.quantity}</td>
              <td className="border p-2 text-right">
                Rp {Number(item.product.price).toLocaleString("id-ID")}
              </td>
              <td className="border p-2 text-right">
                Rp{" "}
                {(
                  Number(item.product.price) * Number(item.quantity)
                ).toLocaleString("id-ID")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="text-right space-y-1">
        <p>
          <strong>Subtotal:</strong> Rp{" "}
          {Number(invoice.subtotal).toLocaleString("id-ID")}
        </p>
        <p>
          <strong>Pajak:</strong> Rp{" "}
          {Number(invoice.tax).toLocaleString("id-ID")}
        </p>
        <p className="text-lg font-bold">
          Total: Rp {Number(invoice.total).toLocaleString("id-ID")}
        </p>
      </div>

      <div className="mt-6 flex justify-end">
        <a
          href={route("admin.invoices.download", invoice.id)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Download PDF
        </a>
      </div>
    </div>
  );
};

export default Show;
