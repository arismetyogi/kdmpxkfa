import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Category, Product } from '@/types';
import { X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import SearchableSelect from '@/components/searchable-select';
import { useForm } from '@inertiajs/react';

interface ProductFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: Product | null;
    categories: Category[];
}

export default function ProductFormModal({ isOpen, onClose, product, categories }: ProductFormModalProps) {
    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: '',
        sku: '',
        description: '',
        dosage: [] as string[],
        pharmacology: '',
        category_id: '',
        base_uom: '',
        order_unit: '',
        content: 1,
        brand: '',
        length: 0,
        width: 0,
        height: 0,
        weight: 0,
        price: 0,
        image: null as File | string | null,
        is_active: true,
    } as {
        name: string;
        sku: string;
        description: string;
        dosage: string[];
        pharmacology: string;
        category_id: string;
        base_uom: string;
        order_unit: string;
        content: number;
        brand: string;
        length: number;
        width: number;
        height: number;
        weight: number;
        price: number;
        image: File | string | null;
        is_active: boolean;
    });

    const [imagePreview, setImagePreview] = useState<string | null>(null);

    useEffect(() => {
        if (product) {
            reset({
                ...product,
                category_id: product.category_id?.toString() ?? '',
                image: product.image ?? '',
                dosage: Array.isArray(product.dosage) ? product.dosage : [],
            });
            // Set image preview if product has an image
            if (typeof product.image === 'string' && product.image !== '') {
                setImagePreview(product.image);
            }
        } else {
            reset({
                name: '',
                sku: '',
                description: '',
                dosage: [],
                pharmacology: '',
                category_id: '',
                base_uom: '',
                order_unit: '',
                content: 1,
                brand: '',
                length: 0,
                width: 0,
                height: 0,
                weight: 0,
                price: 0,
                image: null,
                is_active: true,
            });
            setImagePreview(null);
        }
    }, [product, reset]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (product) {
            // Update existing product
            put(route('admin.products.update', product.id), {
                data,
                forceFormData: true,
                onSuccess: () => {
                    onClose();
                },
            });
        } else {
            // Create new product
            post(route('admin.products.store'), {
                data,
                onSuccess: () => {
                    onClose();
                },
            });
        }
    };
    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value, type } = e.target;

        // Handle checkbox separately
        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setData(name as keyof typeof data, checked as any);
            return;
        }

        setData(name as keyof typeof data, value as any);
    };

    // handle image file input
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('image', file as any);

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    // handle category select (since ShadCN Select doesn't give a real event)
    const handleCategoryChange = (value: string) => {
        setData('category_id', value as any);
    };

    // handle dosage (array of strings) → store as comma-separated input
    const handleDosageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setData('dosage', value
            .split(',')
            .map((d) => d.trim())
            .filter(Boolean) as any);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="fixed inset-0 bg-black/50 " onClick={onClose} />
            <div className="relative mx-4 max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg bg-white dark:bg-zinc-700/90 backdrop-blur-lg shadow-xl">
                <div className="flex items-center justify-between border-b p-6">
                    <h2 className="text-lg font-semibold">{product ? 'Edit Product' : 'Create Product'}</h2>
                    <button onClick={onClose} className="text-gray-400 transition-colors hover:text-gray-600">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 p-6">
                    {/* Basic Info */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="name">Product Name</Label>
                            <Input id="name" name="name" value={data.name} onChange={handleInputChange} required />
                            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                        </div>
                        <div>
                            <Label htmlFor="sku">SKU</Label>
                            <Input id="sku" name="sku" value={data.sku} onChange={handleInputChange} required />
                            {errors.sku && <p className="mt-1 text-sm text-red-600">{errors.sku}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="brand">Brand</Label>
                            <Input id="brand" name="brand" value={data.brand} onChange={handleInputChange} required />
                            {errors.brand && <p className="mt-1 text-sm text-red-600">{errors.brand}</p>}
                        </div>
                        <div>
                            <Label htmlFor="category_id">Category</Label>
                            <SearchableSelect
                            options={categories.map((c) => ({
                                value: c.id.toString(),
                                label: `${c.main_category} > ${c.subcategory1} > ${c.subcategory2}`,
                            }))}
                            value={data.category_id}
                            onChange={handleCategoryChange}
                            placeholder="Select category..."
                            searchPlaceholder="Search for category..."
                            maxResults={10}
                        />
                        {errors.category_id && <p className="mt-1 text-sm text-red-600">{errors.category_id}</p>}
                        </div>
                    </div>

                    {/* Pricing & Units */}
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <Label htmlFor="price">Price</Label>
                            <Input id="price" name="price" type="number" step="0.01" value={data.price} onChange={handleInputChange} required />
                            {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
                        </div>
                        <div>
                            <Label htmlFor="base_uom">Base UOM</Label>
                            <Input id="base_uom" name="base_uom" value={data.base_uom} onChange={handleInputChange} required />
                            {errors.base_uom && <p className="mt-1 text-sm text-red-600">{errors.base_uom}</p>}
                        </div>
                        <div>
                            <Label htmlFor="order_unit">Order Unit</Label>
                            <Input id="order_unit" name="order_unit" value={data.order_unit} onChange={handleInputChange} required />
                            {errors.order_unit && <p className="mt-1 text-sm text-red-600">{errors.order_unit}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="content">Content</Label>
                            <Input id="content" name="content" type="number" value={data.content} onChange={handleInputChange} required />
                            {errors.content && <p className="mt-1 text-sm text-red-600">{errors.content}</p>}
                        </div>
                        <div>
                            <Label htmlFor="weight">Weight (g)</Label>
                            <Input id="weight" name="weight" type="number" value={data.weight} onChange={handleInputChange} required />
                            {errors.weight && <p className="mt-1 text-sm text-red-600">{errors.weight}</p>}
                        </div>
                    </div>

                    {/* Dimensions */}
                    <div>
                        <Label>Dimensions (cm)</Label>
                        <div className="grid grid-cols-3 gap-2">
                            <div>
                                <Input name="length" type="number" placeholder="Length" value={data.length} onChange={handleInputChange} required />
                                {errors.length && <p className="mt-1 text-sm text-red-600">{errors.length}</p>}
                            </div>
                            <div>
                                <Input name="width" type="number" placeholder="Width" value={data.width} onChange={handleInputChange} required />
                                {errors.width && <p className="mt-1 text-sm text-red-600">{errors.width}</p>}
                            </div>
                            <div>
                                <Input name="height" type="number" placeholder="Height" value={data.height} onChange={handleInputChange} required />
                                {errors.height && <p className="mt-1 text-sm text-red-600">{errors.height}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Pharmacology & Dosage */}
                    <div>
                        <Label htmlFor="pharmacology">Pharmacology</Label>
                        <Textarea id="pharmacology" name="pharmacology" value={data.pharmacology} onChange={handleInputChange} rows={2} />
                        {errors.pharmacology && <p className="mt-1 text-sm text-red-600">{errors.pharmacology}</p>}
                    </div>
                    <div>
                        <Label htmlFor="dosage">Dosage (comma-separated)</Label>
                        <Input id="dosage" name="dosage" value={data.dosage?.join(', ') || ''} onChange={handleDosageChange} />
                        {errors.dosage && <p className="mt-1 text-sm text-red-600">{errors.dosage}</p>}
                    </div>

                    {/* Description */}
                    <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" name="description" value={data.description} onChange={handleInputChange} rows={3} />
                        {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
                    </div>

                    {/* Image */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="image">Product Image</Label>
                            <Input id="image" name="image" type="file" accept="image/*" onChange={handleImageChange} />
                            {errors.image && <p className="mt-1 text-sm text-red-600">{errors.image}</p>}
                        </div>
                    </div>

                    {/* Image Preview */}
                    {imagePreview && (
                        <div>
                            <Label>Image Preview</Label>
                            <div className="mt-2">
                                <img src={imagePreview} alt="Preview" className="h-32 w-32 object-cover rounded-lg" />
                            </div>
                        </div>
                    )}

                    {/* Active toggle */}
                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id="is_active"
                            name="is_active"
                            checked={data.is_active}
                            onChange={handleInputChange}
                            className="rounded border-gray-300"
                        />
                        <Label htmlFor="is_active">Active Product</Label>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end space-x-3 pt-4">
                        <Button type="button" variant="outline" onClick={onClose} disabled={processing}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={processing}>
                        {processing ? 'Saving...' : (product ? 'Update Product' : 'Create Product')}
                    </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
