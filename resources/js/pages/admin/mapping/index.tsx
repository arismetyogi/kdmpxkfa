import { Head } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { type BreadcrumbItem } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Plus,
  FileDown,
  Search,
  Info,
  Trash2,
  Link2,
} from "lucide-react";
import { useState } from "react";

const breadcrumbs: BreadcrumbItem[] = [
  { title: "Dashboard", href: "/dashboard" },
  { title: "Mapping", href: "/admin/mapping" },
];

export default function MappingUsers() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [users, setUsers] = useState([
    {
      email: "koperasipurwokerto@kdmp.com",
      username: "PurwokertoMP",
      role: "Koperasi",
      status: "Mapped",
    },
    {
      email: "koperasibangka@kdmp.com",
      username: "BangkaMP",
      role: "Koperasi",
      status: "Not Mapped",
    },
    {
      email: "koperasipalu@kdmp.com",
      username: "PaluMP",
      role: "Koperasi",
      status: "Mapped",
    },
  ]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Filtering logic
  const filteredUsers = users.filter((user) => {
    const matchSearch =
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      user.username.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === "ALL" ||
      (filter === "MAPPED" && user.status === "Mapped") ||
      (filter === "NOT_MAPPED" && user.status === "Not Mapped");
    return matchSearch && matchFilter;
  });

  // Action handlers
  const handleMapping = (user: any) => {
    setSelectedUser(user);
    setShowDetail(true);
  };

  const handleDelete = (idx: number) => {
    setUsers(users.filter((_, i) => i !== idx));
  };

  const handleDetail = (user: any) => {
    setSelectedUser(user);
    setShowDetail(true);
  };

    // === EXPORT TO CSV ===
  const exportToCSV = () => {
    const header = ["Email", "Username", "Role", "Status"];
    const rows = users.map((u) => [u.email, u.username, u.role, u.status]);

    const csvContent =
      [header, ...rows]
        .map((e) => e.map((cell) => `"${cell}"`).join(","))
        .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "mapping_users.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Mapping Users" />

      <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Mapping</h1>
            <p className="text-gray-600 dark:text-gray-400">Mapping Cooperation</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={exportToCSV}
            >
              <FileDown className="w-4 h-4" /> Export
            </Button>
          </div>
        </div>

        {/* Filter & Search */}
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={filter === "ALL" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("ALL")}
            >
              All
            </Button>
            <Button
              variant={filter === "MAPPED" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("MAPPED")}
            >
              Mapped
            </Button>
            <Button
              variant={filter === "NOT_MAPPED" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("NOT_MAPPED")}
            >
              Not Mapped
            </Button>
          </div>
          <div className="relative w-full md:w-1/3">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search users..."
              className="pl-8"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-lg border bg-white dark:bg-gray-900 dark:border-gray-700 shadow-sm">
          <Table className="min-w-[600px]">
            <TableHeader className="bg-gray-50 dark:bg-gray-800">
              <TableRow>
                <TableHead className="font-semibold text-gray-700 dark:text-gray-200">Gmail</TableHead>
                <TableHead className="font-semibold text-gray-700 dark:text-gray-200">Username</TableHead>
                <TableHead className="font-semibold text-gray-700 dark:text-gray-200">Role</TableHead>
                <TableHead className="font-semibold text-gray-700 dark:text-gray-200">Status</TableHead>
                <TableHead className="text-right font-semibold text-gray-700 dark:text-gray-200">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user, i) => (
                <TableRow
                  key={i}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <TableCell className="font-medium text-gray-900 dark:text-gray-100 break-words">
                    {user.email}
                  </TableCell>
                  <TableCell className="break-words dark:text-gray-300">{user.username}</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200">
                      {user.role}
                    </span>
                  </TableCell>
                  <TableCell>
                    {user.status === "Mapped" ? (
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200">
                        Mapped
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200">
                        Not Mapped
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="flex justify-end gap-2 flex-wrap">
                    {user.status === "Mapped" ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                        onClick={() => handleDetail(user)}
                      >
                        <Info className="w-4 h-4" />
                        <span className="hidden sm:inline">Detail</span>
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                        onClick={() => handleMapping(user)}
                      >
                        <Link2 className="w-4 h-4" />
                        <span className="hidden sm:inline">Mapping</span>
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                      onClick={() => handleDelete(i)}
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="hidden sm:inline">Delete</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {/* Footer */}
          <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 border-t bg-gray-50 dark:bg-gray-800 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-center gap-2">
            <span>
              Showing 1 to {filteredUsers.length} of {users.length} results
            </span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                Prev
              </Button>
              <Button variant="outline" size="sm">
                Next
              </Button>
            </div>
          </div>
        </div>

      {/* Detail / Mapping Modal */}
{showDetail && selectedUser && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl p-6 w-full max-w-lg mx-2 animate-fadeIn">
      <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100">
        {selectedUser.status === "Mapped"
          ? `Detail ${selectedUser.email}`
          : `Mapping ${selectedUser.email}`}
      </h2>

      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Nama Koperasi
          </label>
          <Input
            defaultValue="Koperasi Bangka Belitung Desa Mamuju"
            disabled={selectedUser.status === "Mapped"}
            className={selectedUser.status === "Mapped" ? "opacity-60" : ""}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Lokasi Koperasi
          </label>
          <Input
            defaultValue="Jl. Simpang Payung No.3"
            disabled={selectedUser.status === "Mapped"}
            className={selectedUser.status === "Mapped" ? "opacity-60" : ""}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Kelurahan
            </label>
            <Input
              defaultValue="Air Bara"
              disabled={selectedUser.status === "Mapped"}
              className={selectedUser.status === "Mapped" ? "opacity-60" : ""}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Kecamatan
            </label>
            <Input
              defaultValue="Air Gegas"
              disabled={selectedUser.status === "Mapped"}
              className={selectedUser.status === "Mapped" ? "opacity-60" : ""}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Provinsi
            </label>
            <Input
              defaultValue="Bangka Selatan"
              disabled={selectedUser.status === "Mapped"}
              className={selectedUser.status === "Mapped" ? "opacity-60" : ""}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Kode Pos
            </label>
            <Input
              defaultValue="33782"
              disabled={selectedUser.status === "Mapped"}
              className={selectedUser.status === "Mapped" ? "opacity-60" : ""}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Cabang Kimia Farma
          </label>
          {selectedUser.status === "Mapped" ? (
            <Input
              defaultValue="Kimia Farma Sungailiat"
              disabled
              className="opacity-60"
            />
          ) : (
            <select className="w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 focus:ring focus:ring-indigo-500">
              <option>Kimia Farma Sungailiat</option>
              <option>Kimia Farma Pangkalpinang</option>
              <option>Kimia Farma Toboali</option>
              <option>Kimia Farma Belinyu</option>
            </select>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
        <Button variant="destructive" onClick={() => setShowDetail(false)}>
          {selectedUser.status === "Mapped" ? "Tutup" : "Batal"}
        </Button>
        {selectedUser.status === "Not Mapped" && (
          <Button
            onClick={() => {
              setShowDetail(false);
              setShowConfirm(true);
            }}
          >
            Simpan
          </Button>
        )}
      </div>
    </div>
  </div>
)}


        {/* Confirm Save Modal */}
        {showConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl p-6 w-full max-w-sm mx-2 animate-fadeIn">
              <h2 className="text-lg font-bold mb-3 text-gray-900 dark:text-gray-100">Konfirmasi</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Apakah Anda yakin ingin menyimpan perubahan mapping ini? Data lama akan diganti.
              </p>
              <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
                <Button variant="outline" onClick={() => setShowConfirm(false)}>
                  Batal
                </Button>
                <Button
                  onClick={() => {
                    const updated = users.map((u) =>
                      u.email === selectedUser.email ? { ...u, status: "Mapped" } : u
                    );
                    setUsers(updated);
                    setShowConfirm(false);
                  }}
                >
                  Ya, Simpan
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
      <style>{`
        @media (max-width: 640px) {
          .min-w-[600px] { min-width: 100vw; }
        }
        .animate-fadeIn {
          animation: fadeIn .3s;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px);}
          to { opacity: 1; transform: translateY(0);}
        }
      `}</style>
    </AppLayout>
  );
}
