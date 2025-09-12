import { Trash2 } from 'lucide-react';
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
import { Product } from '@/types';

interface DeleteProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: Product | null;
}

export default function DeleteProductModal({
    isOpen,
    onClose,
    product,
}: DeleteProductModalProps) {
    if (!product) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-red-600">
                        <Trash2 className="h-5 w-5" />
                        Delete Product
                    </DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete the product "{product.name}"?
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="text-sm text-muted-foreground">
                        <p>This action cannot be undone. The product and all its information will be permanently removed.</p>
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
                        action={route('admin.products.destroy', product.id)}
                        onSuccess={() => {
                            onClose()
                            toast.success('Product deleted successfully')
                        }}
                    >
                        <Button
                            type="submit"
                            variant="destructive"
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Product
                        </Button>
                    </Form>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
