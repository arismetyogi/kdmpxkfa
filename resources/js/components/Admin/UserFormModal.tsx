import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from '@inertiajs/react';
import { Loader2, Save } from 'lucide-react';
import React, { useEffect } from 'react';
import { toast } from 'sonner';

interface Role {
    id: number;
    name: string;
}

interface User {
    id?: number;
    name?: string;
    username?: string;
    email?: string;
    password?: string;
    password_confirmation?: string;
    roles?: Role[];
}

interface UserFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    user?: User | null;
    roles: Role[];
}

export default function UserFormModal({ isOpen, onClose, user, roles }: UserFormModalProps) {
    const isEditing = !!user?.id;

    const form = useForm({
        name: user?.name || '',
        username: user?.username || '',
        email: user?.email || '',
        password: user?.password || '',
        password_confirmation: '',
        roles: user?.roles?.map((p) => p.id) || [],
    });

    // reset form when modal opens/closes or role changes
    useEffect(() => {
        if (isOpen) {
            form.setData({
                name: user?.name || '',
                username: user?.username || '',
                email: user?.email || '',
                password: user?.password || '',
                password_confirmation: user?.password_confirmation || '',
                roles: user?.roles?.map((p) => p.id) || [],
            });
            form.clearErrors();
        }
    }, [isOpen, user]);

    const handleRoleToggle = (roleId: number) => {
        form.setData('roles', form.data.roles.includes(roleId) ? form.data.roles.filter((id) => id !== roleId) : [...form.data.roles, roleId]);
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
            form.put(route('admin.users.update', user.id), {
                onSuccess: () => {
                    onClose();
                    toast.success('User updated successfully.');
                },
                onError: (e) => {
                    toast.error('Failed to update user.', e);
                },
            });
        } else {
            form.post(route('admin.users.store'), {
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
                                value={form.data.name}
                                onChange={(e) => form.setData('name', e.target.value)}
                                placeholder="Enter user's full name"
                                required
                                className="mt-1"
                            />
                            {form.errors.name && <p className="mt-1 text-sm text-red-600">{form.errors.name}</p>}
                        </div>

                        {/* Username */}
                        <div>
                            <Label htmlFor="username">Username</Label>
                            <Input
                                id="username"
                                name="username"
                                value={form.data.username}
                                onChange={(e) => form.setData('username', e.target.value)}
                                placeholder="Enter username"
                                required
                                className="mt-1"
                            />
                            {form.errors.username && <p className="mt-1 text-sm text-red-600">{form.errors.username}</p>}
                        </div>

                        {/* Email */}
                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                value={form.data.email}
                                onChange={(e) => form.setData('email', e.target.value)}
                                placeholder="Enter user's email"
                                required
                                className="mt-1"
                            />
                            {form.errors.email && <p className="mt-1 text-sm text-red-600">{form.errors.email}</p>}
                        </div>

                        {/* Password */}
                        <div>
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                value={form.data.password}
                                onChange={(e) => form.setData('password', e.target.value)}
                                placeholder="Enter password"
                                required={!isEditing}
                                className="mt-1"
                            />
                            {form.errors.password && <p className="mt-1 text-sm text-red-600">{form.errors.password}</p>}
                        </div>
                        <div>
                            <Label htmlFor="password_confirmation">Password</Label>
                            <Input
                                id="password_confirmation"
                                name="password_confirmation"
                                type="password"
                                value={form.data.password_confirmation}
                                onChange={(e) => form.setData('password_confirmation', e.target.value)}
                                placeholder="Enter password confirmation"
                                className="mt-1"
                            />
                            {form.errors.password_confirmation && <p className="mt-1 text-sm text-red-600">{form.errors.password_confirmation}</p>}
                        </div>

                        {/* Roles */}
                        <div>
                            <Label className="text-base font-medium">Roles</Label>
                            <div className="mt-3 grid max-h-60 grid-cols-2 gap-3 overflow-y-auto rounded-md border p-3">
                                {roles.map((role) => (
                                    <div key={role.id} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`role-${role.id}`}
                                            checked={form.data.roles.includes(role.id)}
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
                        <Button type="button" variant="outline" onClick={onClose} disabled={form.processing}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={form.processing || !form.data.name.trim()}>
                            {form.processing ? (
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
