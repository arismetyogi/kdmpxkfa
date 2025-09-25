import UserMappingModal from '@/components/admin/user-mapping-modal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Apotek, BreadcrumbItem, Paginated, User } from '@/types';
import { Head } from '@inertiajs/react';
import { Edit, FileDown, Link2, Search, Users, UserX } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: route('admin.dashboard') },
    { title: 'Mapping', href: route('admin.mapping.index') },
];

interface MappingProps {
    users: Paginated<User>;
    apoteks: Apotek[];
    allUsers: number;
    activeUsers: number;
}

export default function Mapping({ users, apoteks, allUsers }: MappingProps) {
    const [isMappingModalOpen, setIsMappingModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('ALL');

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
            case 'user':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
        }
    };

    const filteredUsers = users.data.filter((user) => {
        const matchSearch = user.name.toLowerCase().includes(search.toLowerCase()) || user.email.toLowerCase().includes(search.toLowerCase());
        const matchFilter = filter === 'ALL' || (filter === 'MAPPED' && user.apotek !== null) || (filter === 'NOT_MAPPED' && user.apotek === null);
        return matchSearch && matchFilter;
    });

    const exportToCSV = () => {
        const header = ['Name', 'Email', 'Role', 'Status', 'Mapped Apotek'];
        const rows = filteredUsers.map((u) => [
            u.name,
            u.email,
            u.roles?.map((role) => role.name).join(', ') ?? 'No Role',
            u.is_active ? 'Active' : 'Inactive',
            u.apotek ? u.apotek.name : 'Not Mapped',
        ]);

        const csvContent = [header, ...rows].map((e) => e.map((cell) => `"${cell}"`).join(',')).join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'mapping_users.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="User Mapping" />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4 md:p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">User Mapping</h1>
                        <p className="text-muted-foreground">Manage user details, roles, and their assigned apoteks</p>
                    </div>
                    <Button variant="outline" className="flex items-center gap-2" onClick={exportToCSV}>
                        <FileDown className="h-4 w-4" /> Export
                    </Button>
                </div>

                {/* Statistic Cards */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card className="rounded-xl bg-white shadow-md transition-all duration-300 hover:shadow-xl dark:bg-gray-800">
                        <CardHeader className="flex items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                            <Users className="h-5 w-5 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-center text-2xl font-bold">{allUsers}</div>
                            <p className="text-center text-xs text-muted-foreground">All registered users</p>
                        </CardContent>
                    </Card>

                    <Card className="rounded-xl bg-white shadow-md transition-all duration-300 hover:shadow-xl dark:bg-gray-800">
                        <CardHeader className="flex items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Mapped Users</CardTitle>
                            <Link2 className="h-5 w-5 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-center text-2xl font-bold">{users.data.filter((u) => u.apotek !== null).length}</div>
                            <p className="text-center text-xs text-muted-foreground">Users assigned to an apotek</p>
                        </CardContent>
                    </Card>

                    <Card className="rounded-xl bg-white shadow-md transition-all duration-300 hover:shadow-xl dark:bg-gray-800">
                        <CardHeader className="flex items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Not Mapped</CardTitle>
                            <UserX className="h-5 w-5 text-rose-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-center text-2xl font-bold">{users.data.filter((u) => u.apotek === null).length}</div>
                            <p className="text-center text-xs text-muted-foreground">Users not yet assigned</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters & Search */}
                <div className="flex flex-col items-center justify-between gap-3 md:flex-row">
                    <div className="flex flex-wrap gap-2">
                        <Button variant={filter === 'ALL' ? 'default' : 'outline'} size="sm" onClick={() => setFilter('ALL')}>
                            All
                        </Button>
                        <Button variant={filter === 'MAPPED' ? 'default' : 'outline'} size="sm" onClick={() => setFilter('MAPPED')}>
                            Mapped
                        </Button>
                        <Button variant={filter === 'NOT_MAPPED' ? 'default' : 'outline'} size="sm" onClick={() => setFilter('NOT_MAPPED')}>
                            Not Mapped
                        </Button>
                    </div>
                    <div className="relative w-full md:w-1/3">
                        <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-gray-400" />
                        <Input placeholder="Search users..." className="pl-8" value={search} onChange={(e) => setSearch(e.target.value)} />
                    </div>
                </div>

                {/* User Table */}
                <Card className="overflow-hidden rounded-xl">
                    <CardHeader>
                        <CardTitle>Users</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <Table className="min-w-[600px]">
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Role</TableHead>
                                        <TableHead>Permissions</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Apotek Mapping</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredUsers.map((user) => (
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
                                                        <span className="text-sm text-muted-foreground">No role</span>
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
                                                    {user.apotek ? (
                                                        user.apotek.name
                                                    ) : (
                                                        <Button variant="outline" size="sm" onClick={() => handleMapUserApotek(user)}>
                                                            <Edit className="h-4 w-4" /> Map
                                                        </Button>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <UserMappingModal isOpen={isMappingModalOpen} onClose={closeModals} user={selectedUser} apoteks={apoteks} />
        </AppLayout>
    );
}
