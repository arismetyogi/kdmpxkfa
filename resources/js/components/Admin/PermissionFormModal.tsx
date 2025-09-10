import React, { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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

interface PermissionFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    permission: Permission | null;
}

export default function PermissionFormModal({
    isOpen,
    onClose,
    permission,
}: PermissionFormModalProps) {
    const isEditing = !!permission?.id;

    const form = useForm({
        name: permission?.name || '',
    });

    // reset form when modal opens/closes or permission changes
    useEffect(() => {
        if (isOpen) {
            form.setData({
                name: permission?.name || '',
            });
            form.clearErrors();
        }
    }, [isOpen, permission]);
    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEditing && permission?.id) {
            form.put(route('admin.permissions.update', permission.id), {
                onSuccess: () => onClose(),
            });
            toast.success('Permission updated successfully')
        } else {
            form.post(route('admin.permissions.store'), {
                onSuccess: () => onClose(),
            });
            toast.success('Permission created successfully')
    }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {isEditing ? 'Edit Permission' : 'Create New Permission'}
                    </DialogTitle>
                    <DialogDescription>
                        {isEditing
                            ? 'Update the permission details and permissions below.'
                            : 'Fill in the details to create a new permission.'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={submit} className="space-y-6">
                    <div className="space-y-4">
                        {/* Permission Name */}
                        <div>
                            <Label htmlFor="name">Permission Name</Label>
                            <Input
                                id="name"
                                name="name"
                                value={form.data.name}
                                onChange={(e) => form.setData('name', e.target.value)}
                                placeholder="Enter permission name"
                                required
                                className="mt-1"
                            />
                            {form.errors.name && (
                                <p className="text-sm text-red-600 mt-1">
                                    {form.errors.name}
                                </p>
                            )}
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
                                    {isEditing ? 'Update Permission' : 'Create Permission'}
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
