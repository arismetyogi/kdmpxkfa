import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { User } from '@/types';
import { Form } from '@inertiajs/react';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface DeleteUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: User | null;
}

export default function UserDeleteModal({ isOpen, onClose, user }: DeleteUserModalProps) {
    if (!user) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-red-600">
                        <Trash2 className="h-5 w-5" />
                        Delete User
                    </DialogTitle>
                    <DialogDescription>Are you sure you want to delete the user "{user.name}"?</DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="text-sm text-muted-foreground">
                        <p>This action cannot be undone. The user and all its information will be permanently removed.</p>
                    </div>
                </div>

                <DialogFooter>
                    <Button type="button" variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Form
                        method="delete"
                        action={route('admin.users.destroy', user.id)}
                        onSuccess={() => {
                            onClose();
                            toast.success('User deleted successfully');
                        }}
                    >
                        <Button type="submit" variant="destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete User
                        </Button>
                    </Form>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
