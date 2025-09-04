import { Button } from '@/components/ui/button';
import { Category } from '@/types';
import { Trash2 } from 'lucide-react';
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form } from '@inertiajs/react';
import { toast } from 'sonner';

interface DeleteCategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    category: Category | null;
}

export default function DeleteCategoryModal({ isOpen, onClose, category }: DeleteCategoryModalProps) {

    if (!isOpen || !category) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-red-600">
                        <Trash2 className="h-5 w-5" />
                        Delete Category
                    </DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete the category "{category.subcategory1}" {'>'} "{category.subcategory2}" ?
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="text-sm text-muted-foreground">
                        <p>This action cannot be undone. The category and all its information will be permanently removed.</p>
                    </div>
                </div>

                <DialogFooter>
                    <Button type="button" variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Form
                        method="delete"
                        action={route('admin.categories.destroy', category.id)}
                        onSuccess={() => {
                            onClose();
                            toast.success('Category deleted successfully');
                        }}
                    >
                        <Button type="submit" variant="destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Product
                        </Button>
                    </Form>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
