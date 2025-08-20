import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface AdminDashboardProps {
    user: {
        id: number;
        name: string;
        email: string;
        roles: Array<{
            id: number;
            name: string;
        }>;
        permissions: Array<{
            id: number;
            name: string;
        }>;
    };
    stats: {
        total_users: number;
        total_roles: number;
        total_permissions: number;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin',
        href: '/admin',
    },
    {
        title: 'Dashboard',
        href: '/admin',
    },
];

export default function AdminDashboard({ user, stats }: AdminDashboardProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <div className="space-y-6">
                    <div className="mb-8 space-y-0.5">
                        <h2 className="text-xl font-semibold tracking-tight">Admin Dashboard</h2>
                        <p className="text-sm text-muted-foreground">Manage users, roles, and permissions</p>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card className="p-6">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-blue-600">{stats.total_users}</div>
                                <div className="text-sm text-gray-600">Total Users</div>
                            </div>
                        </Card>
                        <Card className="p-6">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-green-600">{stats.total_roles}</div>
                                <div className="text-sm text-gray-600">Total Roles</div>
                            </div>
                        </Card>
                        <Card className="p-6">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-purple-600">{stats.total_permissions}</div>
                                <div className="text-sm text-gray-600">Total Permissions</div>
                            </div>
                        </Card>
                    </div>

                    {/* Current User Info */}
                    <Card className="p-6">
                        <div className="mb-4">
                            <h3 className="text-lg font-semibold">Current User Information</h3>
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

                    {/* Quick Actions */}
                    <Card className="p-6">
                        <div className="mb-4">
                            <h3 className="text-lg font-semibold">Quick Actions</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <a
                                href="/admin/users"
                                className="block p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <div className="font-semibold">Manage Users</div>
                                <div className="text-sm text-gray-600">View and manage user accounts</div>
                            </a>
                            <a
                                href="/admin/roles"
                                className="block p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <div className="font-semibold">Manage Roles</div>
                                <div className="text-sm text-gray-600">Create and assign user roles</div>
                            </a>
                            <a
                                href="/admin/permissions"
                                className="block p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <div className="font-semibold">Manage Permissions</div>
                                <div className="text-sm text-gray-600">Configure system permissions</div>
                            </a>
                        </div>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
