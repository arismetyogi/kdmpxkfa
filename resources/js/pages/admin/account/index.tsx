<<<<<<< HEAD
import { Head, usePage } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { type BreadcrumbItem } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, User, Mail } from "lucide-react";
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
import { Inertia } from "@inertiajs/inertia";

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

  const handleConfirm = (type: "approve" | "reject", account: any) => {
    const url = `account/${account.id}/${type}`;
    Inertia.post(url, {}, {
      onSuccess: () => {
        setAccountsState((prev: any[]) =>
          prev.map(acc =>
            acc.id === account.id
              ? { ...acc, status: type === "approve" ? "Approved" : "Rejected" }
              : acc
          )
        );
        setConfirmAction(null);
      },
      onError: (errors) => console.error(errors),
    });
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
              className={`transition-all duration-200 ${
                s === "Pending"
                  ? filter === s
                    ? "bg-yellow-600 text-white hover:bg-yellow-700"
                    : "border-yellow-400 text-yellow-600 hover:bg-yellow-50"
                  : s === "Approved"
                  ? filter === s
                    ? "bg-teal-600 text-white hover:bg-teal-700"
                    : "border-teal-400 text-teal-600 hover:bg-teal-50"
                  : filter === s
                  ? "bg-red-700 text-white hover:bg-red-800"
                  : "border-red-400 text-red-700 hover:bg-red-50"
              }`}
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
            className="max-w-sm rounded-full"
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
          {filteredAccounts.length > 0 ? (
            filteredAccounts.map((acc: any) => (
              <Card
                key={acc.id}
                className="border border-gray-200 dark:border-gray-700 shadow-lg dark:bg-gray-800 rounded-xl hover:shadow-xl transition-all duration-300"
              >
                <CardContent className="p-6 flex flex-col justify-between gap-4">
                  {/* Header */}
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {acc.tenant_name || acc.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        <Mail className="w-4 h-4" />: {acc.email}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full ${
                        acc.status === "Pending"
                          ? "bg-yellow-200 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                          : acc.status === "Approved"
                          ? "bg-teal-600 text-white"
                          : "bg-red-700 text-white"
                      }`}
                    >
                      {acc.status}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 mt-3">
                    <Button
                      variant="outline"
                      className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-100 transition-all duration-200"
                      onClick={() => setSelectedAccount(acc)}
                    >
                      View Details
                    </Button>
                    {acc.status === "Pending" && (
                      <>
                        <Button
                          className="flex-1 bg-teal-600 text-white hover:bg-teal-700 transition-all duration-200"
                          onClick={() => setConfirmAction({ type: "approve", account: acc })}
                        >
                          Approve
                        </Button>
                        <Button
                          className="flex-1 bg-red-700 text-white hover:bg-red-800 transition-all duration-200"
                          onClick={() => setConfirmAction({ type: "reject", account: acc })}
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
            <p className="text-gray-500 dark:text-gray-400 col-span-full">
              No {filter} accounts found.
            </p>
          )}
        </div>

        {/* Detail Modal */}
        <Dialog
          open={!!selectedAccount}
          onOpenChange={() => setSelectedAccount(null)}
        >
          <DialogContent className="max-w-2xl rounded-2xl shadow-lg dark:bg-gray-900 dark:border-gray-700 w-full p-6">
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
                  <p>
                    <b>SIA Number:</b>{" "}
                    {selectedAccount.sia_number}
                  </p>
                  <p>
                    <b>ID Tenant:</b>{" "}
                    {selectedAccount.tenant_id}
                  </p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Confirm Modal */}
        <Dialog open={!!confirmAction} onOpenChange={() => setConfirmAction(null)}>
          {confirmAction && (
            <DialogContent className="max-w-md rounded-xl dark:bg-gray-900 dark:border-gray-700 p-6">
              <DialogHeader>
                <DialogTitle className="text-lg font-bold">
                  Konfirmasi {confirmAction.type === "approve" ? "Approve" : "Reject"}
                </DialogTitle>
              </DialogHeader>
              <p className="mt-2">
                Apakah Anda yakin ingin{" "}
                <b>
                  {confirmAction.type === "approve" ? "Menyetujui" : "Menolak"}
                </b>{" "}
                akun <b>{confirmAction.account.name}</b>?
              </p>
              <DialogFooter className="mt-4 flex justify-end gap-2">
                <Button
                  variant="outline"
                  className="border-gray-300 text-gray-700 hover:bg-gray-100 transition-all duration-200"
                  onClick={() => setConfirmAction(null)}
                >
                  Batal
                </Button>
                <Button
                  className={`${
                    confirmAction.type === "approve"
                      ? "bg-teal-600 text-white hover:bg-teal-700"
                      : "bg-red-700 text-white hover:bg-red-800"
                  } transition-all duration-200`}
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
=======
import { Head, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar, Mail, User } from 'lucide-react';
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { format } from 'date-fns';
import { Inertia } from '@inertiajs/inertia';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: route('admin.dashboard') },
    { title: 'Account Management', href: route('admin.account.index') },
];

export default function MappingUsers() {
    const { props }: any = usePage();
    const users = props.users || [];

    const [filter, setFilter] = useState<'pending' | 'approved' | 'rejected'>('pending');
    const [search, setSearch] = useState('');
    const [selectedAccount, setSelectedAccount] = useState<any | null>(null);
    const [confirmAction, setConfirmAction] = useState<{
        type: 'approve' | 'reject';
        account: any;
    } | null>(null);
    const [dateFilter, setDateFilter] = useState('');
    const [accountsState, setAccountsState] = useState(users);

    // Filtering
    const filteredAccounts = accountsState.filter((acc: any) => {
        const matchStatus = acc.status === filter;
        const matchName = acc.name.toLowerCase().includes(search.toLowerCase());
        const matchDate = !dateFilter || (acc.created_at && format(new Date(acc.created_at), 'yyyy-MM-dd') === dateFilter);
        return matchStatus && matchName && matchDate;
    });

    const handleConfirm = (type: 'approve' | 'reject', account: any) => {
        const url = `account/${account.id}/${type}`;
        Inertia.post(
            url,
            {},
            {
                onSuccess: () => {
                    setAccountsState((prev: any[]) =>
                        prev.map((acc) => (acc.id === account.id ? { ...acc, status: type === 'approve' ? 'approved' : 'rejected' } : acc)),
                    );
                    setConfirmAction(null);
                },
                onError: (errors) => console.error(errors),
            },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Mapping Users" />

            <div className="flex flex-col gap-10 p-4 md:p-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Account Management</h1>
                    <p className="text-gray-600 dark:text-gray-400">Manage incoming cooperative accounts and continue mapping.</p>
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-3">
                    {[
                        { value: 'pending', label: 'Pending' },
                        { value: 'approved', label: 'Approved' },
                        { value: 'rejected', label: 'Rejected' },
                    ].map((s) => (
                        <Button
                            key={s.value}
                            variant={filter === s.value ? 'default' : 'outline'}
                            className={`transition-all duration-200 ${
                                s.value === 'pending'
                                    ? filter === s.value
                                        ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                                        : 'border-yellow-400 text-yellow-600 hover:bg-yellow-50'
                                    : s.value === 'approved'
                                      ? filter === s.value
                                          ? 'bg-teal-600 text-white hover:bg-teal-700'
                                          : 'border-teal-400 text-teal-600 hover:bg-teal-50'
                                      : filter === s.value
                                        ? 'bg-red-700 text-white hover:bg-red-800'
                                        : 'border-red-400 text-red-700 hover:bg-red-50'
                            }`}
                            onClick={() => setFilter(s.value as any)}
                        >
                            {s.label} ({accountsState.filter((a: any) => a.status === s.value).length})
                        </Button>
                    ))}
                </div>

                {/* Search & Date */}
                <div className="flex flex-col items-center gap-3 sm:flex-row">
                    <Input
                        placeholder="Search by cooperative name..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="max-w-sm rounded-full"
                    />
                    <div className="flex items-center gap-2">
                        <Calendar size={18} />
                        <input
                            type="date"
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
                            className="rounded-md border px-3 py-2 text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                        />
                    </div>
                </div>

                {/* Cards */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
                    {filteredAccounts.length > 0 ? (
                        filteredAccounts.map((acc: any) => (
                            <Card
                                key={acc.id}
                                className="rounded-xl border border-gray-200 shadow-lg transition-all duration-300 hover:shadow-xl dark:border-gray-700 dark:bg-gray-800"
                            >
                                <CardContent className="flex flex-col justify-between gap-4 p-6">
                                    {/* Header */}
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{acc.tenant_name || acc.name}</h3>
                                            <p className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                                                <Mail className="h-4 w-4" />: {acc.email}
                                            </p>
                                        </div>
                                        <span
                                            className={`rounded-full px-3 py-1 text-xs font-medium ${
                                                acc.status === 'pending'
                                                    ? 'bg-yellow-200 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                                                    : acc.status === 'approved'
                                                      ? 'bg-teal-600 text-white'
                                                      : 'bg-red-700 text-white'
                                            }`}
                                        >
                                            {acc.status}
                                        </span>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="mt-3 flex gap-2">
                                        <Button
                                            variant="outline"
                                            className="flex-1 border-gray-300 text-gray-700 transition-all duration-200 hover:bg-gray-100"
                                            onClick={() => setSelectedAccount(acc)}
                                        >
                                            View Details
                                        </Button>
                                        {acc.status === 'pending' && (
                                            <>
                                                <Button
                                                    className="flex-1 bg-teal-600 text-white transition-all duration-200 hover:bg-teal-700"
                                                    onClick={() => setConfirmAction({ type: 'approve', account: acc })}
                                                >
                                                    Approve
                                                </Button>
                                                <Button
                                                    className="flex-1 bg-red-700 text-white transition-all duration-200 hover:bg-red-800"
                                                    onClick={() => setConfirmAction({ type: 'reject', account: acc })}
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
                        <p className="col-span-full text-gray-500 dark:text-gray-400">No {filter} accounts found.</p>
                    )}
                </div>

                {/* Detail Modal */}
                <Dialog open={!!selectedAccount} onOpenChange={() => setSelectedAccount(null)}>
                    <DialogContent className="w-full max-w-2xl rounded-2xl p-6 shadow-lg dark:border-gray-700 dark:bg-gray-900">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 text-lg font-bold text-blue-600 dark:text-blue-400">
                                <User className="h-5 w-5" /> Account Details
                            </DialogTitle>
                        </DialogHeader>

                        {selectedAccount && (
                            <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2">
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
                                        <b>Apotek:</b> {selectedAccount.apotek?.name ?? '-'}
                                    </p>
                                    <p>
                                        <b>Roles:</b> {selectedAccount.roles?.map((r: any) => r.name).join(', ')}
                                    </p>
                                    <p>
                                        <b>SIA Number:</b> {selectedAccount.sia_number}
                                    </p>
                                    <p>
                                        <b>ID Tenant:</b> {selectedAccount.tenant_id}
                                    </p>
                                </div>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>

                {/* Confirm Modal */}
                <Dialog open={!!confirmAction} onOpenChange={() => setConfirmAction(null)}>
                    {confirmAction && (
                        <DialogContent className="max-w-md rounded-xl p-6 dark:border-gray-700 dark:bg-gray-900">
                            <DialogHeader>
                                <DialogTitle className="text-lg font-bold">
                                    Konfirmasi {confirmAction.type === 'approve' ? 'Approve' : 'Reject'}
                                </DialogTitle>
                            </DialogHeader>
                            <p className="mt-2">
                                Apakah Anda yakin ingin <b>{confirmAction.type === 'approve' ? 'Menyetujui' : 'Menolak'}</b> akun{' '}
                                <b>{confirmAction.account.name}</b>?
                            </p>
                            <DialogFooter className="mt-4 flex justify-end gap-2">
                                <Button
                                    variant="outline"
                                    className="border-gray-300 text-gray-700 transition-all duration-200 hover:bg-gray-100"
                                    onClick={() => setConfirmAction(null)}
                                >
                                    Batal
                                </Button>
                                <Button
                                    className={`${
                                        confirmAction.type === 'approve'
                                            ? 'bg-teal-600 text-white hover:bg-teal-700'
                                            : 'bg-red-700 text-white hover:bg-red-800'
                                    } transition-all duration-200`}
                                    onClick={() => handleConfirm(confirmAction.type, confirmAction.account)}
                                >
                                    Ya, {confirmAction.type === 'approve' ? 'Setujui' : 'Tolak'}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    )}
                </Dialog>
            </div>
        </AppLayout>
    );
>>>>>>> source/master
}
