import DeleteUserModal from '@/components/admin/user-delete-modal';
import UserFormModal from '@/components/admin/user-form-modal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Apotek, BreadcrumbItem, Paginated, Permission, Role, User } from '@/types';
import { Head } from '@inertiajs/react';
import { Edit, Plus, Shield, Trash2, UserCog, UserX } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: route('admin.dashboard'),
    },
    {
        title: 'Admins',
        href: route('admin.admins.index'),
    },
];

interface AdminUserProps {
    admins: Paginated<User>;
    roles: Role[];
    apoteks: Apotek[];
    permissions: Permission[];
    allAdmins: number;
    adminAdmins: number;
    activeAdmins: number;
}

export default function AdminAdmins({ admins, roles, apoteks, allAdmins, adminAdmins, activeAdmins }: AdminUserProps) {
    // Modal states
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const handleCreateUser = () => {
        setSelectedUser(null);
        setIsCreateModalOpen(true);
    };

    const handleEditUser = (admin: User) => {
        setSelectedUser(admin);
        setIsEditModalOpen(true);
    };

    const handleDeleteUser = (admin: User) => {
        setSelectedUser(admin);
        setIsDeleteModalOpen(true);
    };

    const closeModals = () => {
        setIsCreateModalOpen(false);
        setIsEditModalOpen(false);
        setIsDeleteModalOpen(false);
        setSelectedUser(null);
    };

    const formatRoleName = (role: string) => {
        return role
            .split('-')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
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
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin Management" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Admin Management</h1>
                        <p className="text-muted-foreground">Manage admin details, roles and their permissions</p>
                    </div>
                    <Button onClick={handleCreateUser}>
                        <Plus className="mr-2 h-4 w-4" />
                        Create Admin User
                    </Button>
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Admins</CardTitle>
                            <UserCog className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{allAdmins}</div>
                            <p className="text-xs text-muted-foreground">All admins in the system</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Admins</CardTitle>
                            <Shield className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{adminAdmins}</div>
                            <p className="text-xs text-muted-foreground">Total active admins in the system</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Dormant</CardTitle>
                            <UserX className="h-4 w-4 text-red-300" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{allAdmins - activeAdmins}</div>
                            <p className="text-xs text-muted-foreground">Total inactive admins in the system</p>
                        </CardContent>
                    </Card>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>Admins</CardTitle>
                        <CardDescription>View and manage all admins and their associated roles and permissions</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Permissions</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {admins.data.map((admin) => (
                                    <TableRow key={admin.id}>
                                        <TableCell>
                                            <div className="flex items-center space-x-2">
                                                <UserCog className="h-4 w-4 text-muted-foreground" />
                                                <span>{admin.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-wrap gap-1">
                                                {admin.roles && admin.roles.length > 0 ? (
                                                    admin.roles.map((role: Role) => (
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
                                                {admin.permissions && admin.permissions.length > 0 ? (
                                                    <Badge variant="secondary" className="text-xs">
                                                        {admin.permissions.length}
                                                    </Badge>
                                                ) : (
                                                    <span className="text-sm text-muted-foreground">No permissions</span>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="secondary"
                                                className={`text-xs text-white ${admin.is_active ? 'bg-emerald-500' : 'bg-rose-500'}`}
                                            >
                                                {admin.is_active ? 'active' : 'inactive'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center space-x-2">
                                                <Button variant="outline" size="sm" onClick={() => handleEditUser(admin)}>
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="text-red-600 hover:text-red-700"
                                                    onClick={() => handleDeleteUser(admin)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>

            {/* Create User Modal */}
            <UserFormModal isOpen={isCreateModalOpen} onClose={closeModals} user={null} roles={roles} apoteks={apoteks} />

            {/* Edit User Modal */}
            <UserFormModal isOpen={isEditModalOpen} onClose={closeModals} user={selectedUser} roles={roles} apoteks={apoteks} />

            {/* Delete User Modal */}
            <DeleteUserModal isOpen={isDeleteModalOpen} onClose={closeModals} user={selectedUser} />
        </AppLayout>
    );
}
