import AppLayout from "@/layouts/app-layout";
import { Head, Link } from "@inertiajs/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, X, ArrowLeft } from "lucide-react";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

export default function Show({ purchaseOrder: initialPO }: any) {
  const [purchaseOrder, setPurchaseOrder] = useState(initialPO);
  const [openAccept, setOpenAccept] = useState(false);
  const [openReject, setOpenReject] = useState(false);

  const subtotal = purchaseOrder.products.reduce(
    (acc: number, p: any) => acc + p.price * p.pivot.quantity,
    0
  );
  const ppn = Math.round(subtotal * 0.11);

  return (
    <AppLayout
      breadcrumbs={[
        { title: "Dashboard", href: "/dashboard" },
        { title: "Purchase Orders", href: "/purchase" },
        { title: purchaseOrder.id_transaksi, href: "#" },
      ]}
    >
      <Head title={`Purchase Order ${purchaseOrder.id_transaksi}`} />

      <div className="p-4 md:p-6 space-y-6 dark:bg-gray-950 dark:text-gray-100">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold">
              Purchase Order {purchaseOrder.id_transaksi}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base">
              Detail View of Selected Purchase Order
            </p>
          </div>
          {purchaseOrder.status === "Pending" && (
            <div className="flex flex-wrap gap-2">
              <Button
                className="bg-green-600 hover:bg-green-700 text-sm md:text-base"
                onClick={() => setOpenAccept(true)}
              >
                <Check className="w-4 h-4 mr-1" /> Accept
              </Button>
              <Button
                variant="destructive"
                className="text-sm md:text-base"
                onClick={() => setOpenReject(true)}
              >
                <X className="w-4 h-4 mr-1" /> Reject
              </Button>
            </div>
          )}
        </div>

        {/* Back Button */}
        <Link href="/purchase">
          <Button
            variant="outline"
            className="flex items-center gap-2 text-sm dark:border-gray-700 dark:text-gray-200"
          >
            <ArrowLeft className="w-4 h-4" /> Back to List
          </Button>
        </Link>

        {/* Info Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Order Info */}
          <Card className="p-4 lg:col-span-2 space-y-3 dark:bg-gray-900 dark:border-gray-700">
            <h3 className="font-semibold text-base">Order Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 text-sm">
              <p>
                <b>Purchase Order ID:</b> {purchaseOrder.id_transaksi}
              </p>
              <p>
                <b>Nama Koperasi:</b> {purchaseOrder.merchant_name}
              </p>
              <p>
                <b>Tanggal:</b>{" "}
                {new Date(purchaseOrder.created_at).toLocaleDateString("id-ID")}
              </p>
              <p>
                <b>Status:</b>{" "}
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    purchaseOrder.status === "Pending"
                      ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                      : purchaseOrder.status === "Accepted"
                      ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                      : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                  }`}
                >
                  {purchaseOrder.status}
                </span>
              </p>
            </div>
          </Card>

          {/* Delivery Info */}
          <Card className="p-4 dark:bg-gray-900 dark:border-gray-700">
            <h3 className="font-semibold text-base">Delivery Information</h3>
            <div className="text-sm mt-2 space-y-1">
              <p>Estimated Delivery:</p>
              <p className="font-medium">1-2 Business Days</p>
            </div>
          </Card>
        </div>

        {/* Products Table */}
        <Card className="p-4 overflow-x-auto dark:bg-gray-900 dark:border-gray-700">
          <h3 className="font-semibold mb-3 text-base">
            Products ({purchaseOrder.products.length} Items)
          </h3>
          <div className="w-full">
            <table className="min-w-full text-sm border rounded-lg overflow-hidden dark:border-gray-700">
              <thead className="bg-gray-100 dark:bg-gray-800 dark:text-gray-300">
                <tr>
                  <th className="p-2 text-left">Product Name</th>
                  <th className="p-2 text-left">Quantity</th>
                  <th className="p-2 text-left">Unit Price</th>
                  <th className="p-2 text-left">Sub Total</th>
                </tr>
              </thead>
              <tbody>
                {purchaseOrder.products.map((p: any, i: number) => {
                  const qty = p.pivot.quantity;
                  const subtotal = p.price * qty;
                  return (
                    <tr
                      key={i}
                      className="border-t hover:bg-gray-50 dark:hover:bg-gray-800 dark:border-gray-700"
                    >
                      <td className="p-2">{p.name}</td>
                      <td className="p-2">{qty}</td>
                      <td className="p-2">
                        Rp {p.price.toLocaleString("id-ID")}
                      </td>
                      <td className="p-2">
                        Rp {subtotal.toLocaleString("id-ID")}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot className="border-t bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
                <tr>
                  <td colSpan={3} className="p-2 font-semibold text-right">
                    Sub Total Value
                  </td>
                  <td className="p-2 font-semibold">
                    Rp {subtotal.toLocaleString("id-ID")}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </Card>

        {/* Order Summary */}
        <Card className="p-4 lg:w-1/3 ml-auto dark:bg-gray-900 dark:border-gray-700">
          <h3 className="font-semibold text-base">Order Summary</h3>
          <div className="text-sm space-y-1 mt-2">
            <p>Total Products: {purchaseOrder.products.length}</p>
            <p>
              Total Quantity:{" "}
              {purchaseOrder.products.reduce(
                (acc: number, p: any) => acc + p.pivot.quantity,
                0
              )}
            </p>
            <p>Sub Total Order: Rp{subtotal.toLocaleString("id-ID")}</p>
            <p>PPN (11%): Rp{ppn.toLocaleString("id-ID")}</p>
          </div>
          <div className="border-t mt-3 pt-2 font-bold text-lg dark:border-gray-700">
            Total Value: Rp{" "}
            {Number(purchaseOrder.total_nominal).toLocaleString("id-ID")}
          </div>
        </Card>
      </div>

      {/* Confirm Accept */}
      <ConfirmDialog
        open={openAccept}
        onOpenChange={setOpenAccept}
        title="Accept Purchase Order"
        description={`Apakah yakin ingin menerima ${purchaseOrder.id_transaksi}?`}
        confirmText="Accept"
        onConfirm={() => {
          setPurchaseOrder({ ...purchaseOrder, status: "Accepted" });
        }}
      />

      {/* Confirm Reject */}
      <ConfirmDialog
        open={openReject}
        onOpenChange={setOpenReject}
        title="Reject Purchase Order"
        description={`Apakah yakin ingin menolak ${purchaseOrder.id_transaksi}?`}
        confirmText="Reject"
        onConfirm={() => {
          setPurchaseOrder({ ...purchaseOrder, status: "Rejected" });
        }}
      />
    </AppLayout>
  );
}
