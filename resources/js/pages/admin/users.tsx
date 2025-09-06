import AppLayout from '@/layouts/app-layout';
import { Apotek, BreadcrumbItem, Paginated, User } from '@/types';
import { Head } from '@inertiajs/react';
import { Edit, Shield, Users, UserX } from 'lucide-react';
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import UserMappingModal from '@/components/Admin/UserMappingModal';


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin',
        href: '/admin',
    },
    {
        title: 'Users',
        href: '/admin/users',
    },
];

interface AdminUserProps {
    users: Paginated<User>;
    apoteks: Apotek[];
    allUsers: number;
    activeUsers: number;
}

export default function AdminUsers({ users, apoteks, allUsers, activeUsers }: AdminUserProps) {
    // Modal states
    const [isMappingModalOpen, setIsMappingModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const handleMapUserApotek = (user: User) => {
        setSelectedUser(user);
        setIsMappingModalOpen(true);
    };

    const closeModals = () => {
        setIsMappingModalOpen(false);
        setSelectedUser(null);
    };

    const formatRoleName = (role: string) => {
        return role
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    const getRoleColor = (roleName: string) => {
        switch (roleName.toLowerCase()) {
            case 'super-admin':
                return 'bg-red-200 text-red-900 dark:bg-red-900 dark:text-red-300';
            case 'admin':
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
            case 'manager':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
            case 'user':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="User Management" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
                        <p className="text-muted-foreground">Manage user details, roles and their permissions</p>
                    </div>
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{allUsers}</div>
                            <p className="text-xs text-muted-foreground">All users in the system</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                            <Shield className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{activeUsers}</div>
                            <p className="text-xs text-muted-foreground">Active users in the system</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Dormant</CardTitle>
                            <UserX className="h-4 w-4 text-red-300" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{allUsers - activeUsers}</div>
                            <p className="text-xs text-muted-foreground">Total inactive users in the system</p>
                        </CardContent>
                    </Card>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>Users</CardTitle>
                        <CardDescription>View and manage all users and their associated roles and permissions</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Permissions</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Outlet Mapping</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.data.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell>
                                            <div className="flex items-center space-x-2">
                                                <Users className="h-4 w-4 text-muted-foreground" />
                                                <span>{user.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-wrap gap-1">
                                                {user.roles && user.roles.length > 0 ? (
                                                    user.roles.map((role) => (
                                                        <Badge key={role.id} variant="secondary" className={`text-xs ${getRoleColor(role.name)}`}>
                                                            {formatRoleName(role.name)}
                                                        </Badge>
                                                    ))
                                                ) : (
                                                    <span className="text-sm text-muted-foreground">No role assigned</span>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-wrap gap-1">
                                                {user.permissions && user.permissions.length > 0 ? (
                                                    <Badge variant="secondary" className="text-xs">
                                                        {user.permissions.length}
                                                    </Badge>
                                                ) : (
                                                    <span className="text-sm text-muted-foreground">No permissions</span>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="secondary"
                                                className={`text-xs text-white ${user.is_active ? 'bg-emerald-500' : 'bg-rose-500'}`}
                                            >
                                                {user.is_active ? 'active' : 'inactive'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center space-x-2">
                                                {user.apotek ?
                                                    user.apotek?.name
                                                    :
                                                <Button variant="outline" size="sm" onClick={() => handleMapUserApotek(user)}>
                                                    <Edit className="h-4 w-4" /> Map
                                                </Button>
                                                }
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>

            {/* Edit User Modal */}
            <UserMappingModal isOpen={isMappingModalOpen} onClose={closeModals} user={selectedUser} apoteks={apoteks} />
        </AppLayout>
    );
}
