import { Head } from '@inertiajs/react';
import { Plus, Shield, Users, Settings, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { useState } from 'react';
import PermissionsFormModal from '@/components/admin/permissions-form-modal';
import PermissionDeleteModal from '@/components/admin/permission-delete-modal';

interface Permission {
    id: number;
    name: string;
    users_count: number;
}

interface AdminPermissionProps {
    permissions: Permission[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: route('admin.dashboard'),
    },
    {
        title: 'Permission',
        href: route('admin.permissions.index'),
    },
];

export default function AdminPermission({ permissions }: AdminPermissionProps) {

    // Modal states
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedPermission, setSelectedPermission] = useState<Permission | null>(null);

    const formatPermissionName = (permission: string) => {
        return permission
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    const handleCreatePermission = () => {
        setSelectedPermission(null);
        setIsCreateModalOpen(true);
    };

    const handleEditPermission = (permission: Permission) => {
        setSelectedPermission(permission);
        setIsEditModalOpen(true);
    };

    const handleDeletePermission = (permission: Permission) => {
        setSelectedPermission(permission);
        setIsDeleteModalOpen(true);
    };

    const closeModals = () => {
        setIsCreateModalOpen(false);
        setIsEditModalOpen(false);
        setIsDeleteModalOpen(false);
        setSelectedPermission(null);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Permission Management" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Permission Management</h1>
                        <p className="text-muted-foreground">
                            Manage permissions
                        </p>
                    </div>
                    <Button onClick={handleCreatePermission}>
                        <Plus className="mr-2 h-4 w-4" />
                        Create Permission
                    </Button>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Permission</CardTitle>
                            <Shield className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{permissions.length}</div>
                            <p className="text-xs text-muted-foreground">
                                Active permissions in the system
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Permissions</CardTitle>
                            <Settings className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{permissions.length}</div>
                            <p className="text-xs text-muted-foreground">
                                Available permissions
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">System Users</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {permissions.reduce((total, permission) => total + (permission.users_count || 0), 0)}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Users with assigned permissions
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Permission & Permissions</CardTitle>
                        <CardDescription>
                            View and manage all permissions and their associated permissions
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Permission Name</TableHead>
                                    <TableHead>Users</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {permissions.map((permission) => (
                                    <TableRow key={permission.id}>
                                        <TableCell>
                                            <div className="flex items-center space-x-2">
                                                <Badge >
                                                    {formatPermissionName(permission.name)}
                                                </Badge>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center space-x-2">
                                                <Users className="h-4 w-4 text-muted-foreground" />
                                                <span>{permission.users_count || 0}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center space-x-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleEditPermission(permission)}
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="text-red-600 hover:text-red-700"
                                                    onClick={() => handleDeletePermission(permission)}
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

            {/* Create Permission Modal */}
            <PermissionsFormModal
                isOpen={isCreateModalOpen}
                onClose={closeModals}
                permission={null}
            />

            {/* Edit Permission Modal */}
            <PermissionsFormModal
                isOpen={isEditModalOpen}
                onClose={closeModals}
                permission={selectedPermission}
            />

            {/* Delete Permission Modal */}
            <PermissionDeleteModal
                isOpen={isDeleteModalOpen}
                onClose={closeModals}
                permission={selectedPermission}
            />
            </div>
        </AppLayout>
    );
}
