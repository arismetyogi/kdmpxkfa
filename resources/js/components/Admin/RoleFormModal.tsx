import React, { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

interface Permission {
    id: number;
    name: string;
}

interface Role {
    id?: number;
    name: string;
    permissions?: Permission[];
}

interface RoleFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    role?: Role | null;
    permissions: Permission[];
}

export default function RoleFormModal({
    isOpen,
    onClose,
    role,
    permissions,
}: RoleFormModalProps) {
    const isEditing = !!role?.id;

    const form = useForm({
        name: role?.name || '',
        permissions: role?.permissions?.map((p) => p.id) || [],
    });

    // reset form when modal opens/closes or role changes
    useEffect(() => {
        if (isOpen) {
            form.setData({
                name: role?.name || '',
                permissions: role?.permissions?.map((p) => p.id) || [],
            });
            form.clearErrors();
        }
    }, [isOpen, role]);

    const handlePermissionToggle = (permissionId: number) => {
        form.setData(
            'permissions',
            form.data.permissions.includes(permissionId)
                ? form.data.permissions.filter((id) => id !== permissionId)
                : [...form.data.permissions, permissionId]
        );
    };

    const formatPermissionName = (permission: string) => {
        return permission
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEditing && role?.id) {
            form.put(route('admin.roles.update', role.id), {
                onSuccess: () => onClose(),
            });
            toast.success('Role updated successfully')
        } else {
            form.post(route('admin.roles.store'), {
                onSuccess: () => onClose(),
            });
            toast.success('Role created successfully')
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {isEditing ? 'Edit Role' : 'Create New Role'}
                    </DialogTitle>
                    <DialogDescription>
                        {isEditing
                            ? 'Update the role details and permissions below.'
                            : 'Fill in the details to create a new role.'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={submit} className="space-y-6">
                    <div className="space-y-4">
                        {/* Role Name */}
                        <div>
                            <Label htmlFor="name">Role Name</Label>
                            <Input
                                id="name"
                                name="name"
                                value={form.data.name}
                                onChange={(e) => form.setData('name', e.target.value)}
                                placeholder="Enter role name"
                                required
                                className="mt-1"
                            />
                            {form.errors.name && (
                                <p className="text-sm text-red-600 mt-1">
                                    {form.errors.name}
                                </p>
                            )}
                        </div>

                        {/* Permissions */}
                        <div>
                            <Label className="text-base font-medium">Permissions</Label>
                            <div className="mt-3 grid grid-cols-2 gap-3 max-h-60 overflow-y-auto border rounded-md p-3">
                                {permissions.map((permission) => (
                                    <div key={permission.id} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`permission-${permission.id}`}
                                            checked={form.data.permissions.includes(permission.id)}
                                            onCheckedChange={() => handlePermissionToggle(permission.id)}
                                        />
                                        <Label
                                            htmlFor={`permission-${permission.id}`}
                                            className="text-sm font-normal cursor-pointer"
                                        >
                                            {formatPermissionName(permission.name)}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={form.processing}
                        >
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
                                    {isEditing ? 'Update Role' : 'Create Role'}
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
