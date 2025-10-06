import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Toaster, toast } from 'sonner';
import { useEffect, useRef, useState } from 'react';
import { Bell } from 'lucide-react';

interface DashboardProps {
  user: {
    id: number;
    name: string;
    email: string;
    roles: Array<{ id: number; name: string }>;
    permissions: Array<{ id: number; name: string }>;
  };
  stats: Record<string, number>;
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: route('dashboard'),
  },
];

export default function Dashboard({ user, stats }: DashboardProps) {
  const roles = user.roles.map((r) => r.name);

  const isSuperAdmin = roles.includes('super-admin');
  const isApotek = roles.includes('admin-apotek');
  const isBusdev = roles.includes('admin-busdev');

  // 🔔 Simpan jumlah order sebelumnya
  const prevOrdersRef = useRef<number>(stats?.new_orders || 0);
  const [unread, setUnread] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (isApotek && stats?.new_orders > prevOrdersRef.current) {
      setUnread(stats.new_orders);
      toast.success(`📦 ${stats.new_orders} order baru masuk hari ini!`);
    }
    prevOrdersRef.current = stats?.new_orders || 0;
  }, [isApotek, stats?.new_orders]);

  const handleMarkAsRead = () => {
    setUnread(0);
    setOpen(false);
  };

  // 🔔 Icon + Dropdown Notifikasi
  const renderNotificationIcon = () => (
    <div className="fixed top-16 right-6 z-50">
      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="relative p-2 rounded-full hover:bg-accent bg-background shadow-md"
        >
          <Bell className="h-6 w-6 text-gray-600 dark:text-gray-300" />
          {unread > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
              {unread}
            </span>
          )}
        </button>

        {open && (
          <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-900 border border-border rounded-lg shadow-lg overflow-hidden">
            <div className="p-3 text-sm font-semibold border-b border-border">
              Notifikasi
            </div>

            {unread > 0 ? (
              <div className="p-3 space-y-2">
                <div className="text-sm text-foreground">
                  📦 {unread} order baru belum dibaca
                </div>
                <a
                  href={route('orders.index')}
                  className="block text-center text-sm font-medium text-blue-600 hover:underline"
                  onClick={handleMarkAsRead}
                >
                  Lihat Pesanan
                </a>
              </div>
            ) : (
              <div className="p-3 text-sm text-muted-foreground">
                Tidak ada notifikasi baru
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  // Super Admin Dashboard
  const renderSuperAdminDashboard = () => (
    <>
      <div className="mb-8 space-y-0.5">
        <h2 className="text-xl font-semibold tracking-tight text-foreground">Admin Dashboard</h2>
        <p className="text-sm text-muted-foreground">Manage users, roles, and permissions</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 text-center">
          <div className="text-3xl font-bold text-primary">{stats.total_users}</div>
          <div className="text-sm text-muted-foreground">Total Users</div>
        </Card>
        <Card className="p-6 text-center">
          <div className="text-3xl font-bold text-primary">{stats.total_roles}</div>
          <div className="text-sm text-muted-foreground">Total Roles</div>
        </Card>
        <Card className="p-6 text-center">
          <div className="text-3xl font-bold text-primary">{stats.total_permissions}</div>
          <div className="text-sm text-muted-foreground">Total Permissions</div>
        </Card>
      </div>
    </>
  );

  // Apotek Dashboard
  const renderApotekDashboard = () => (
    <>
      <div className="mb-8 space-y-0.5">
        <h2 className="text-xl font-semibold tracking-tight text-foreground">Apotek Dashboard</h2>
        <p className="text-sm text-muted-foreground">Kelola pesanan dan produk apotek</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 text-center">
          <div className="text-3xl font-bold text-primary">{stats.total_orders}</div>
          <div className="text-sm text-muted-foreground">Total Orders</div>
        </Card>
        <Card className="p-6 text-center">
          <div className="text-3xl font-bold text-primary">{stats.pending_orders}</div>
          <div className="text-sm text-muted-foreground">Pending Orders</div>
        </Card>
      </div>
    </>
  );

  // BusDev Dashboard
  const renderBusdevDashboard = () => (
    <>
      <div className="mb-8 space-y-0.5">
        <h2 className="text-xl font-semibold tracking-tight text-foreground">BusDev Dashboard</h2>
        <p className="text-sm text-muted-foreground">Pantau mapping & account management</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 text-center">
          <div className="text-3xl font-bold text-primary">{stats.total_mapping}</div>
          <div className="text-sm text-muted-foreground">Total Mapping</div>
        </Card>
        <Card className="p-6 text-center">
          <div className="text-3xl font-bold text-primary">{stats.total_accounts}</div>
          <div className="text-sm text-muted-foreground">Total Accounts</div>
        </Card>
      </div>
    </>
  );

  const renderUserInfo = () => (
    <Card className="p-6 border border-border bg-card">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground">Current User Information</h3>
      </div>
      <div className="space-y-4">
        <div>
          <span className="font-semibold">Name:</span> {user.name}
        </div>
        <div>
          <span className="font-semibold">Email:</span> {user.email}
        </div>
        <div>
          <span className="font-semibold">Roles:</span>
          <div className="mt-2 flex flex-wrap gap-2">
            {user.roles.map((role) => (
              <Badge key={role.id} variant="secondary">
                {role.name}
              </Badge>
            ))}
          </div>
        </div>
        <div>
          <span className="font-semibold">Permissions:</span>
          <div className="mt-2 flex flex-wrap gap-2">
            {user.permissions.map((permission) => (
              <Badge key={permission.id} variant="outline">
                {permission.name}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );

  const renderQuickActions = () => (
    <Card className="p-6 border border-border bg-card">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground">Quick Actions</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <a
          href={route('admin.users.index')}
          className="block p-4 border border-border rounded-lg hover:bg-accent transition-colors"
        >
          <div className="font-semibold text-foreground">Manage Users</div>
          <div className="text-sm text-muted-foreground">View and manage user accounts</div>
        </a>
        <a
          href={route('admin.roles.index')}
          className="block p-4 border border-border rounded-lg hover:bg-accent transition-colors"
        >
          <div className="font-semibold text-foreground">Manage Roles</div>
          <div className="text-sm text-muted-foreground">Create and assign user roles</div>
        </a>
        <a
          href={route('admin.permissions.index')}
          className="block p-4 border border-border rounded-lg hover:bg-accent transition-colors"
        >
          <div className="font-semibold text-foreground">Manage Permissions</div>
          <div className="text-sm text-muted-foreground">Configure system permissions</div>
        </a>
      </div>
    </Card>
  );

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Dashboard" />
      <Toaster position="top-right" richColors />

      {/*{isApotek && renderNotificationIcon()}*/}

      <div className="flex flex-col gap-6 p-4">
        {isSuperAdmin && renderSuperAdminDashboard()}
        {isApotek && renderApotekDashboard()}
        {isBusdev && renderBusdevDashboard()}
        {renderUserInfo()}
        {isSuperAdmin && renderQuickActions()}
      </div>
    </AppLayout>
  );
}
