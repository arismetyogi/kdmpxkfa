import { Head, usePage } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { type BreadcrumbItem } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, User } from "lucide-react";
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
  { title: "Account Management", href: "/admin/account" },
];

export default function MappingUsers() {
  const { props }: any = usePage();
  const users = props.users || [];

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
  const [accountsState, setAccountsState] = useState(users);

  // Filtering
  const filteredAccounts = accountsState.filter((acc: any) => {
    const matchStatus = acc.status === filter;
    const matchName = acc.name.toLowerCase().includes(search.toLowerCase());
    const matchDate =
      !dateFilter ||
      (acc.created_at &&
        format(new Date(acc.created_at), "yyyy-MM-dd") === dateFilter);
    return matchStatus && matchName && matchDate;
  });

  // Approve / Reject handler
  const handleConfirm = (type: "approve" | "reject", account: any) => {
    setAccountsState((prev: any[]) =>
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
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Account Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage incoming cooperative accounts and continue mapping.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-3">
          {["Pending", "Approved", "Rejected"].map((s) => (
            <Button
              key={s}
              variant={filter === s ? "default" : "outline"}
              onClick={() => setFilter(s as any)}
            >
              {s} ({accountsState.filter((a: any) => a.status === s).length})
            </Button>
          ))}
        </div>

        {/* Search & Date */}
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

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredAccounts.length > 0 ? (
            filteredAccounts.map((acc: any) => (
              <Card
                key={acc.id}
                className="border border-gray-200 dark:border-gray-700 shadow-md dark:bg-gray-800 hover:shadow-lg hover:scale-[1.01] transition-all duration-300 rounded-2xl"
              >
                <CardContent className="p-5 flex flex-col gap-4">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100">
                      {acc.tenant_name || acc.name}
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

                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    📅{" "}
                    {acc.created_at
                      ? format(new Date(acc.created_at), "yyyy-MM-dd, hh:mm:ss a")
                      : "-"}
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    👤 {acc.name}
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    📧 {acc.email}
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    📞 {acc.phone ?? "-"}
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    🏥 {acc.apotek?.name ?? "-"}
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    🔑 {acc.roles?.map((r: any) => r.name).join(", ")}
                  </p>

                  <div className="flex gap-3 mt-3">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => setSelectedAccount(acc)}
                    >
                      View Details
                    </Button>
                    {acc.status === "Pending" && (
                      <>
                        <Button
                          className="flex-1 bg-green-600 text-white"
                          onClick={() =>
                            setConfirmAction({ type: "approve", account: acc })
                          }
                        >
                          Approve
                        </Button>
                        <Button
                          className="flex-1 bg-red-600 text-white"
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

        {/* Detail Modal */}
        <Dialog
          open={!!selectedAccount}
          onOpenChange={() => setSelectedAccount(null)}
        >
          <DialogContent className="max-w-2xl rounded-2xl shadow-lg dark:bg-gray-900 dark:border-gray-700 w-full">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-lg font-bold text-blue-600 dark:text-blue-400">
                <User className="w-5 h-5" /> Account Details
              </DialogTitle>
            </DialogHeader>

            {selectedAccount && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div className="space-y-4">
                  <p>
                    <b>Name:</b> {selectedAccount.name}
                  </p>
                  <p>
                    <b>Email:</b> {selectedAccount.email}
                  </p>
                  <p>
                    <b>Phone:</b> {selectedAccount.phone}
                  </p>
                </div>
                <div className="space-y-4">
                  <p>
                    <b>Apotek:</b> {selectedAccount.apotek?.name ?? "-"}
                  </p>
                  <p>
                    <b>Roles:</b>{" "}
                    {selectedAccount.roles?.map((r: any) => r.name).join(", ")}
                  </p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Confirm Modal */}
        <Dialog open={!!confirmAction} onOpenChange={() => setConfirmAction(null)}>
          {confirmAction && (
            <DialogContent className="max-w-md rounded-xl dark:bg-gray-900 dark:border-gray-700">
              <DialogHeader>
                <DialogTitle className="text-lg font-bold">
                  Konfirmasi {confirmAction.type === "approve" ? "Approve" : "Reject"}
                </DialogTitle>
              </DialogHeader>
              <p>
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
                  variant={
                    confirmAction.type === "approve" ? "default" : "destructive"
                  }
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
