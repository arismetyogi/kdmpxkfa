import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from '@inertiajs/react';
import { Loader2, Save } from 'lucide-react';
import React, { useEffect } from 'react';
import { toast } from 'sonner';
import SearchableSelect from '@/components/searchable-select';
import { Apotek, Role, User } from '@/types';

interface UserFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    user?: User | null;
    apoteks?: Apotek[];
    roles: Role[];
}

export default function UserFormModal({ isOpen, onClose, user, roles, apoteks }: UserFormModalProps) {
    const isEditing = !!user?.id;

    const { data, setData, put, post, processing, errors, clearErrors } = useForm({
        name: user?.name || '',
        username: user?.username || '',
        email: user?.email || '',
        password: '',
        password_confirmation: '',
        apotek_id: user?.apotek_id || '',
        roles: user?.roles?.map((p) => p.id) || [],
    });

    // reset form when modal opens/closes or role changes
    useEffect(() => {
        if (isOpen) {
            setData({
                name: user?.name || '',
                username: user?.username || '',
                email: user?.email || '',
                password: '',
                password_confirmation: '',
                apotek_id: user?.apotek_id || '',
                roles: user?.roles?.map((p) => p.id) || [],
            });
            clearErrors();
        }
    }, [isOpen, user]);

    const handleRoleToggle = (roleId: number) => {
        setData('roles', data.roles.includes(roleId) ? data.roles.filter((id) => id !== roleId) : [...data.roles, roleId]);
    };

    const handleApotekChange = (value: string | number) => {
        setData('apotek_id', value);
    };

    const formatRoleName = (role: string) => {
        return role
            .split(' ')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEditing && user?.id) {
            put(route('admin.users.update', user.id), {
                onSuccess: () => {
                    onClose();
                    toast.success('User updated successfully.');
                },
                onError: (e) => {
                    toast.error('Failed to update user.', e);
                },
            });
        } else {
            post(route('admin.users.store'), {
                onSuccess: () => {
                    onClose();
                    toast.success('User created successfully');
                },
                onError: (e) => {
                    toast.error('An unexpected error occurred.', e);
                },
            });
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>{isEditing ? 'Edit User' : 'Create New User'}</DialogTitle>
                    <DialogDescription>
                        {isEditing ? 'Update the role details and roles below.' : 'Fill in the details to create a new role.'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={submit} className="space-y-6">
                    <div className="space-y-4">
                        {/* User Name */}
                        <div>
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                                id="name"
                                name="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="Enter user's full name"
                                required
                                className="mt-1"
                            />
                            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                        </div>

                        {/* Username */}
                        {!isEditing && (
                            <div>
                                <Label htmlFor="username">Username</Label>
                                <Input
                                    id="username"
                                    name="username"
                                    value={data.username}
                                    onChange={(e) => setData('username', e.target.value)}
                                    placeholder="Enter username"
                                    required
                                    className="mt-1"
                                />
                                {errors.username && <p className="mt-1 text-sm text-red-600">{errors.username}</p>}
                            </div>
                        )}

                        {/* Email */}
                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="Enter user's email"
                                required
                                className="mt-1"
                            />
                            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                        </div>

                        {/* Password */}
                        <div>
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="Enter password"
                                required={!isEditing}
                                className="mt-1"
                            />
                            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                        </div>
                        <div>
                            <Label htmlFor="password_confirmation">Password</Label>
                            <Input
                                id="password_confirmation"
                                name="password_confirmation"
                                type="password"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                placeholder="Enter password confirmation"
                                className="mt-1"
                            />
                            {errors.password_confirmation && <p className="mt-1 text-sm text-red-600">{errors.password_confirmation}</p>}
                        </div>

                        {/* Apotek */}
                        <div>
                            <Label htmlFor="apotek_id">Apotek</Label>
                            <SearchableSelect
                                options={(apoteks ?? []).map((a) => ({
                                    value: a.id.toString(),
                                    label: `${a.sap_id} - ${a.name}`,
                                }))}
                                value={data.apotek_id.toString()}
                                onChange={handleApotekChange}
                                placeholder="Select an apotek..."
                                searchPlaceholder="Search apoteks..."
                                maxResults={10}
                            />
                            {errors.apotek_id && <p className="mt-1 text-sm text-red-600">{errors.apotek_id}</p>}
                        </div>

                        {/* Roles */}
                        <div>
                            <Label className="text-base font-medium">Roles</Label>
                            <div className="mt-3 grid max-h-60 grid-cols-2 gap-3 overflow-y-auto rounded-md border p-3">
                                {roles.map((role) => (
                                    <div key={role.id} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`role-${role.id}`}
                                            checked={data.roles.includes(role.id)}
                                            onCheckedChange={() => handleRoleToggle(role.id)}
                                        />
                                        <Label htmlFor={`role-${role.id}`} className="cursor-pointer text-sm font-normal">
                                            {formatRoleName(role.name)}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose} disabled={processing}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing || !data.name.trim()}>
                            {processing ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="mr-2 h-4 w-4" />
                                    {isEditing ? 'Update User' : 'Create User'}
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
