import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Product } from '@/types';
import { useForm } from '@inertiajs/react';
import { Loader2, Save } from 'lucide-react';
import React, { useEffect } from 'react';
import { toast } from 'sonner';

interface Category {
    id?: number;
    name?: string;
}

interface ProductFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    product?: Product | null;
    categories?: Category[] | null;
}

export default function ProductFormModal({ isOpen, onClose, product, categories }: ProductFormModalProps) {
    const isEditing = !!product?.id;

    const availableCategories = categories ?? [
        { id: 1, name: 'category 1' },
        { id: 2, name: 'category 2' },
    ];

    type ProductForm = {
        name: string;
        sku: string;
        category: Category;
        base_uom: string;
        price: number | null;
        weight: number | null;
        length: number | null;
        width: number | null;
        height: number | null;
        image_url: string;
        image_alt: string;
        is_active: boolean;
    };

    const form = useForm<ProductForm>({
        name: product?.name || '',
        sku: product?.sku || '',
        category: product?.category || ({} as Category),
        base_uom: product?.base_uom || '',
        price: product?.price ?? null,
        weight: product?.weight ?? null,
        length: product?.length ?? null,
        width: product?.width ?? null,
        height: product?.height ?? null,
        image_url: product?.image_url || product?.image_alt || '',
        image_alt: product?.image_alt || '',
        is_active: product?.is_active ?? false,
    });

    // reset form when modal opens/closes or category changes
    useEffect(() => {
        if (isOpen) {
            form.setData({
                name: product?.name || '',
                sku: product?.sku || '',
                category: product?.category || undefined,
                base_uom: product?.base_uom || '',
                price: product?.price || null,
                weight: product?.weight || null,
                length: product?.length || null,
                width: product?.width || null,
                height: product?.height || null,
                image_url: product?.image_url || product?.image_alt || '',
                image_alt: product?.image_alt || '',
                is_active: product?.is_active || false,
            });
            form.clearErrors();
        }
    }, [isOpen, product]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEditing && product?.id) {
            form.put(route('admin.products.update', product.id), {
                onSuccess: () => {
                    onClose();
                    toast.success('Product updated successfully.');
                },
                onError: (e) => {
                    toast.error('Failed to update product.', e);
                },
            });
        } else {
            form.post(route('admin.products.store'), {
                onSuccess: () => {
                    onClose();
                    toast.success('Product created successfully');
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
                    <DialogTitle>{isEditing ? 'Edit Product' : 'Create New Product'}</DialogTitle>
                    <DialogDescription>
                        {isEditing ? 'Update the product details below.' : 'Fill in the details to create a new product.'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={submit} className="space-y-6">
                    <div className="space-y-4">
                        {/* Product Name */}
                        <div>
                            <Label htmlFor="name">Product Name</Label>
                            <Input
                                id="name"
                                name="name"
                                value={form.data.name}
                                onChange={(e) => form.setData('name', e.target.value)}
                                placeholder="Enter product's full name"
                                required
                                className="mt-1"
                            />
                            {form.errors.name && <p className="mt-1 text-sm text-red-600">{form.errors.name}</p>}
                        </div>

                        {/* SKU Id */}
                        <div>
                            <Label htmlFor="sku">SKU ID</Label>
                            <Input
                                id="sku"
                                name="sku"
                                value={form.data.sku}
                                onChange={(e) => form.setData('sku', e.target.value)}
                                placeholder="Enter sku"
                                required
                                className="mt-1"
                            />
                            {form.errors.sku && <p className="mt-1 text-sm text-red-600">{form.errors.sku}</p>}
                        </div>

                        {/* Category */}
                        <div>
                            <Label className="text-base font-medium">Category</Label>
                            <Select
                                value={form.data.category.id?.toString() ?? ""}
                                onValueChange={(value) => {
                                    const selected = availableCategories.find((c) => c.id?.toString() === value);
                                    form.setData('category', selected ?? {} as Category);
                                }}
                            >
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {availableCategories.map((c) => (
                                        <SelectItem key={c.id} value={c.id?.toString() ?? ""}>
                                            {c.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Base UOM */}
                        <div>
                            <Label htmlFor="base_uom">Satuan</Label>
                            <Input
                                id="base_uom"
                                name="base_uom"
                                value={form.data.base_uom}
                                onChange={(e) => form.setData('base_uom', e.target.value)}
                                placeholder="Enter base UOM"
                                required
                                className="mt-1"
                            />
                            {form.errors.base_uom && <p className="mt-1 text-sm text-red-600">{form.errors.base_uom}</p>}
                        </div>

                        {/* Price */}
                        <div>
                            <Label htmlFor="price">Harga Satuan</Label>
                            <Input
                                id="price"
                                name="price"
                                value={Number(form.data.price)}
                                onChange={(e) => form.setData('price', e.target.value === '' ? null : Number(e.target.value))}
                                placeholder="Enter base UOM"
                                required
                                className="mt-1"
                            />
                            {form.errors.price && <p className="mt-1 text-sm text-red-600">{form.errors.price}</p>}
                        </div>

                        {/* Weight */}
                        <div>
                            <Label htmlFor="sku">Berat</Label>
                            <Input
                                id="weight"
                                name="weight"
                                value={Number(form.data.weight)}
                                onChange={(e) => form.setData('weight', e.target.value === '' ? null : Number(e.target.value))}
                                placeholder="Enter base UOM"
                                required
                                className="mt-1"
                            />
                            {form.errors.weight && <p className="mt-1 text-sm text-red-600">{form.errors.weight}</p>}
                        </div>

                        {/* Dimension */}
                        <div className="flex items-center gap-2 space-x-1">
                            <Label htmlFor="length">PanjangXLebarXTinggi</Label>
                            <div>
                                <Input
                                    id="length"
                                    name="length"
                                    value={Number(form.data.length)}
                                    onChange={(e) => form.setData('length', e.target.value === '' ? null : Number(e.target.value))}
                                    placeholder="P"
                                    required
                                    className="mt-1"
                                />
                                {form.errors.length && <p className="mt-1 text-sm text-red-600">{form.errors.length}</p>}
                            </div>
                            x
                            <div>
                                <Input
                                    id="width"
                                    name="width"
                                    type="number"
                                    value={Number(form.data.width)}
                                    onChange={(e) => form.setData('width', e.target.value === '' ? null : Number(e.target.value))}
                                    placeholder="L"
                                    required
                                    className="mt-1"
                                />
                                {form.errors.width && <p className="mt-1 text-sm text-red-600">{form.errors.width}</p>}
                            </div>
                            x
                            <div>
                                <Input
                                    id="height"
                                    name="height"
                                    value={Number(form.data.height)}
                                    onChange={(e) => form.setData('height', e.target.value === '' ? null : Number(e.target.value))}
                                    placeholder="T"
                                    required
                                    className="mt-1"
                                />
                                {form.errors.height && <p className="mt-1 text-sm text-red-600">{form.errors.height}</p>}
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
                                    {isEditing ? 'Update Product' : 'Create Product'}
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
