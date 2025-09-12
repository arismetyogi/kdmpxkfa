import { Trash2, AlertTriangle } from 'lucide-react';
import { Form } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
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
    users_count?: number;
}

interface DeletePermissionModalProps {
    isOpen: boolean;
    onClose: () => void;
    permission: Permission | null;
}

export default function DeletePermissionModal({
    isOpen,
    onClose,
    permission,
}: DeletePermissionModalProps) {
    if (!permission) return null;

    const hasUsers = (permission.users_count || 0) > 0;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-red-600">
                        <Trash2 className="h-5 w-5" />
                        Delete Permission
                    </DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete the permission "{permission.name}"?
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    {hasUsers && (
                        <div className="flex items-start gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md dark:bg-yellow-900/20 dark:border-yellow-800">
                            <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                            <div className="text-sm text-yellow-800 dark:text-yellow-200">
                                <p className="font-medium">Warning</p>
                                <p>
                                    This permission is currently assigned to {permission.users_count} user(s).
                                    Deleting it will remove the permission from all users.
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="text-sm text-muted-foreground">
                        <p>This action cannot be undone. The permission will be permanently removed.</p>
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                    >
                        Cancel
                    </Button>
                    <Form
                        method="delete"
                        action={route('admin.permissions.destroy', permission.id)}
                        onSuccess={() => {
                            onClose()
                            toast.success('Permission deleted successfully')
                        }}
                    >
                        <Button
                            type="submit"
                            variant="destructive"
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Permission
                        </Button>
                    </Form>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
