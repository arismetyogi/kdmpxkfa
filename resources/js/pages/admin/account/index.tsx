import { Head } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { type BreadcrumbItem } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, User, X } from "lucide-react";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { format } from "date-fns";

const breadcrumbs: BreadcrumbItem[] = [
  { title: "Dashboard", href: "/dashboard" },
  { title: "Account Management", href: "/admin/mapping" },
];

export default function MappingUsers() {
  const accounts = [
    {
      id: 1,
      name: "Koperasi Desa Alun Alun Purwokerto",
      submitted: new Date("2025-08-21T08:02:01"),
      contact: "Agus Setyawan",
      email: "koperasidesapurwokerto@kdmp.com",
      phone: "+6285664120442",
      status: "Pending",
      address: "Jalan Jenderal Sudirman No.23 KAV 4",
      kelurahan: "Sokanegara",
      kecamatan: "Purwokerto Timur",
      kabupaten: "Banyumas",
      provinsi: "Jawa Tengah",
    },
    {
      id: 2,
      name: "Koperasi Desa Bangka",
      submitted: new Date("2025-08-20T09:15:00"),
      contact: "Budi Santoso",
      email: "koperasibangka@kdmp.com",
      phone: "+6281234567890",
      status: "Approved",
      address: "Jl. Simpang Payung No.3",
      kelurahan: "Air Bara",
      kecamatan: "Air Gegas",
      kabupaten: "Bangka Selatan",
      provinsi: "Bangka Belitung",
    },
    {
      id: 3,
      name: "Koperasi Desa Maju Bersama",
      submitted: new Date("2025-08-22T10:30:00"),
      contact: "Siti Aminah",
      email: "koperasimajubersama@kdmp.com",
      phone: "+6281122334455",
      status: "Pending",
      address: "Jl. Merdeka No.10",
      kelurahan: "Merdeka",
      kecamatan: "Bumi Baru",
      kabupaten: "Bumi Indah",
      provinsi: "Jawa Barat",
    },
    {
      id: 4,
      name: "Koperasi Desa Sejahtera",
      submitted: new Date("2025-08-19T07:45:00"),
      contact: "Rudi Hartono",
      email: "koperasisejahtera@kdmp.com",
      phone: "+6289988776655",
      status: "Rejected",
      address: "Jl. Sejahtera No.5",
      kelurahan: "Sejahtera",
      kecamatan: "Makmur",
      kabupaten: "Makmur Jaya",
      provinsi: "Jawa Timur",
    },
  ];

  const [filter, setFilter] = useState<"Pending" | "Approved" | "Rejected">(
    "Pending"
  );
  const [search, setSearch] = useState("");
  const [selectedAccount, setSelectedAccount] = useState<any | null>(null);
  const [confirmAction, setConfirmAction] = useState<{
    type: "approve" | "reject";
    account: any;
  } | null>(null);
  const [dateFilter, setDateFilter] = useState("");
  const [accountsState, setAccountsState] = useState(accounts);

  // Filtering logic
  const filteredAccounts = accountsState.filter((acc) => {
    const matchStatus = acc.status === filter;
    const matchName = acc.name.toLowerCase().includes(search.toLowerCase());
    const matchDate =
      !dateFilter ||
      format(acc.submitted, "yyyy-MM-dd") === dateFilter;
    return matchStatus && matchName && matchDate;
  });

  // Handler untuk approve/reject
  const handleConfirm = (type: "approve" | "reject", account: any) => {
    setAccountsState((prev) =>
      prev.map((acc) =>
        acc.id === account.id
          ? { ...acc, status: type === "approve" ? "Approved" : "Rejected" }
          : acc
      )
    );
    setConfirmAction(null);
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Mapping Users" />

      <div className="flex flex-col gap-10 p-4 md:p-6">
        {/* ================== HEADER ================== */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Account Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage incoming cooperative accounts and continue mapping.
          </p>
        </div>

        {/* ================== FILTER TABS ================== */}
        <div className="flex gap-3">
          {["Pending", "Approved", "Rejected"].map((s) => (
            <Button
              key={s}
              variant={filter === s ? "default" : "outline"}
              onClick={() => setFilter(s as any)}
            >
              {s} ({accountsState.filter((a) => a.status === s).length})
            </Button>
          ))}
        </div>

        {/* ================== SEARCH & DATE FILTER ================== */}
        <div className="flex gap-3 flex-col sm:flex-row items-center">
          <Input
            placeholder="Search by cooperative name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
          />
          <div className="flex items-center gap-2">
            <Calendar size={18} />
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="border rounded-md px-3 py-2 text-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700"
            />
          </div>
        </div>

        {/* ================== ACCOUNT CARDS ================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredAccounts.length > 0 ? (
            filteredAccounts.map((acc) => (
              <Card
                key={acc.id}
                className="border border-gray-200 dark:border-gray-700 shadow-md dark:bg-gray-800 hover:shadow-lg hover:scale-[1.01] transition-all duration-300 rounded-2xl"
              >
                <CardContent className="p-5 flex flex-col gap-4">
                  {/* Header */}
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100">
                      {acc.name}
                    </h3>
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full shadow-sm ${
                        acc.status === "Pending"
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                          : acc.status === "Approved"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                      }`}
                    >
                      {acc.status}
                    </span>
                  </div>

                  {/* Info */}
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    📅 {format(acc.submitted, "yyyy-MM-dd, hh:mm:ss a")}
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    👤 {acc.contact}
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    📧 {acc.email}
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    📞 {acc.phone}
                  </p>

                  {/* Buttons */}
                  <div className="flex gap-3 mt-3">
                    <Button
                      variant="outline"
                      className="flex-1 border-gray-300 dark:border-gray-600 hover:bg-blue-50 hover:border-blue-500 hover:text-blue-600 transition-colors"
                      onClick={() => setSelectedAccount(acc)}
                    >
                      View Details
                    </Button>
                    {acc.status === "Pending" && (
                      <>
                        <Button
                          className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-md transition-colors"
                          onClick={() =>
                            setConfirmAction({ type: "approve", account: acc })
                          }
                        >
                          Approve
                        </Button>
                        <Button
                          className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-md transition-colors"
                          onClick={() =>
                            setConfirmAction({ type: "reject", account: acc })
                          }
                        >
                          Reject
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-gray-500 dark:text-gray-400">
              No {filter} accounts found.
            </p>
          )}
        </div>

        {/* ================== DETAIL MODAL ================== */}
        <Dialog open={!!selectedAccount} onOpenChange={() => setSelectedAccount(null)}>
          <DialogContent className="max-w-2xl rounded-2xl shadow-lg dark:bg-gray-900 dark:border-gray-700 w-full">
            <DialogHeader>
              <div className="flex items-center gap-2 justify-between">
                <DialogTitle className="flex items-center gap-2 text-lg font-bold text-blue-600 dark:text-blue-400">
                  <User className="w-5 h-5" /> Account Details
                </DialogTitle>
              </div>
            </DialogHeader>

            {selectedAccount && (
              <form className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                {/* Left Column */}
                <div className="space-y-4">
                  {["name", "contact", "email", "phone"].map((field) => (
                    <div key={field}>
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-400 capitalize">
                        {field}
                      </label>
                      <input
                        type="text"
                        value={selectedAccount[field]}
                        readOnly
                        className="w-full rounded-md border bg-gray-50 dark:bg-gray-800 dark:border-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100"
                      />
                    </div>
                  ))}
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Waktu Pendaftaran
                    </label>
                    <input
                      type="text"
                      value={format(selectedAccount.submitted, "yyyy-MM-dd, hh:mm:ss a")}
                      readOnly
                      className="w-full rounded-md border bg-gray-50 dark:bg-gray-800 dark:border-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100"
                    />
                  </div>
                  {["address", "kelurahan", "kecamatan", "kabupaten", "provinsi"].map(
                    (field) => (
                      <div key={field}>
                        <label className="text-sm font-medium text-gray-600 dark:text-gray-400 capitalize">
                          {field}
                        </label>
                        <input
                          type="text"
                          value={selectedAccount[field]}
                          readOnly
                          className="w-full rounded-md border bg-gray-50 dark:bg-gray-800 dark:border-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100"
                        />
                      </div>
                    )
                  )}
                </div>
              </form>
            )}
          </DialogContent>
        </Dialog>

        {/* ================== CONFIRMATION MODAL ================== */}
        <Dialog open={!!confirmAction} onOpenChange={() => setConfirmAction(null)}>
          {confirmAction && (
            <DialogContent className="max-w-md rounded-xl dark:bg-gray-900 dark:border-gray-700">
              <DialogHeader>
                <DialogTitle className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  Konfirmasi {confirmAction.type === "approve" ? "Approve" : "Reject"}
                </DialogTitle>
              </DialogHeader>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Apakah Anda yakin ingin{" "}
                <b>
                  {confirmAction.type === "approve" ? "Menyetujui" : "Menolak"}
                </b>{" "}
                akun <b>{confirmAction.account.name}</b>?
              </p>
              <DialogFooter className="mt-4 flex justify-end gap-2">
                <Button variant="outline" onClick={() => setConfirmAction(null)}>
                  Batal
                </Button>
                <Button
                  variant={confirmAction.type === "approve" ? "default" : "destructive"}
                  onClick={() =>
                    handleConfirm(confirmAction.type, confirmAction.account)
                  }
                >
                  Ya, {confirmAction.type === "approve" ? "Setujui" : "Tolak"}
                </Button>
              </DialogFooter>
            </DialogContent>
          )}
        </Dialog>
      </div>
    </AppLayout>
  );
}
