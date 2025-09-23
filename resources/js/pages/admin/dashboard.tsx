import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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

    //BusDev Dashboard
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
