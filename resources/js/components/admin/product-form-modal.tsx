import SearchableSelect from '@/components/searchable-select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Category, Product } from '@/types';
import { useForm } from '@inertiajs/react';
import { X } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface ProductFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: Product | null;
    categories: Category[];
}

export default function ProductFormModal({ isOpen, onClose, product, categories }: ProductFormModalProps) {
    const { data, setData, post, put, processing, errors } = useForm({
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
        image: [] as string[],
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
        image: string[];
        is_active: boolean;
    });

    const [imagePreview, setImagePreview] = useState<string | null>(null);

    useEffect(() => {
        console.log('Product data:', product);
        if (product) {
            // Prepare the product data for the form
            setData('name', product.name || '');
            setData('sku', product.sku || '');
            setData('description', product.description || '');
            setData('dosage', Array.isArray(product.dosage) ? product.dosage : []);
            setData('pharmacology', product.pharmacology || '');
            setData('category_id', product.category_id?.toString() || '');
            setData('base_uom', product.base_uom || '');
            setData('order_unit', product.order_unit || '');
            setData('content', product.content || 1);
            setData('brand', product.brand || '');
            setData('length', product.length || 0);
            setData('width', product.width || 0);
            setData('height', product.height || 0);
            setData('weight', product.weight || 0);
            setData('price', product.price || 0);
            setData('image', Array.isArray(product.image) ? product.image : []);
            setData('is_active', typeof product.is_active === 'boolean' ? product.is_active : true);

            // Set image preview if product has images
            if (Array.isArray(product.image) && product.image.length > 0) {
                setImagePreview(product.image[0]);
            }
        } else {
            setData('name', '');
            setData('sku', '');
            setData('description', '');
            setData('dosage', []);
            setData('pharmacology', '');
            setData('category_id', '');
            setData('base_uom', '');
            setData('order_unit', '');
            setData('content', 1);
            setData('brand', '');
            setData('length', 0);
            setData('width', 0);
            setData('height', 0);
            setData('weight', 0);
            setData('price', 0);
            setData('image', []);
            setData('is_active', true);
            setImagePreview(null);
        }
    }, [product]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Prepare the submit data, but handle the image field specially
        // If the image array is empty, don't include it to avoid validation issues
        const submitData = {
            ...data
        };

        // Only include image if it has values
        if (data.image && Array.isArray(data.image) && data.image.length > 0) {
            submitData.image = data.image;
        } else {
            delete (submitData as any).image; // Remove image from submit data if empty
        }

        if (product) {
            // Update existing product - use post with _method to avoid PUT issues
            put(route('admin.products.update', product.id), {
                ...submitData,
                // _method: 'PUT', // Use POST with _method to simulate PUT
                forceFormData: true,
                onSuccess: () => {
                    onClose();
                },
            });
        } else {
            // Create new product
            post(route('admin.products.store'), {
                ...submitData,
                forceFormData: true,
                onSuccess: () => {
                    onClose();
                },
            });
        }
    };
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;

        // Handle checkbox separately
        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setData(name as keyof typeof data, checked as any);
            return;
        }

        // Skip image field as it's handled differently
        if (name !== 'image') {
            setData(name as keyof typeof data, value as any);
        }
    };



    // handle category select (since ShadCN Select doesn't give a real event)
    const handleCategoryChange = (value: string) => {
        setData('category_id', value as any);
    };

    // handle dosage (array of strings) → store as comma-separated input
    const handleDosageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setData(
            'dosage',
            value
                .split(',')
                .map((d) => d.trim())
                .filter(Boolean) as any,
        );
    };

    // Add a new image URL to the array
    const addImageUrl = () => {
        const urlInput = prompt('Enter the image URL:');
        if (urlInput && urlInput.trim() !== '') {
            const currentImages = [...data.image];
            currentImages.push(urlInput);
            setData('image', currentImages);
        }
    };

    // Remove an image URL from the array by index
    const removeImageUrl = (index: number) => {
        const currentImages = [...data.image];
        currentImages.splice(index, 1);
        setData('image', currentImages);

        // Update image preview if the removed image was the first one
        if (index === 0 && currentImages.length > 0) {
            setImagePreview(currentImages[0]);
        } else if (currentImages.length === 0) {
            setImagePreview(null);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="fixed inset-0 bg-black/50" onClick={onClose} />
            <div className="relative mx-4 max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg bg-white shadow-xl backdrop-blur-lg dark:bg-zinc-700/90">
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
                    <div className="space-y-4">
                        <div>
                            <Label>Product Images</Label>
                            <div className="flex gap-2 mt-2">
                                <Input
                                    id="image"
                                    name="image"
                                    type="text"
                                    value=""
                                    onChange={(e) => {
                                        if (e.target.value && e.target.value.trim() !== '') {
                                            const currentImages = [...data.image];
                                            currentImages.push(e.target.value.trim());
                                            setData('image', currentImages);
                                            e.target.value = ''; // Clear the input
                                            if (currentImages.length === 1) {
                                                setImagePreview(currentImages[0]);
                                            }
                                        }
                                    }}
                                    placeholder="Enter image URL and press Enter"
                                />
                                <Button type="button" onClick={addImageUrl} variant="outline">Add</Button>
                            </div>
                            {errors.image && <p className="mt-1 text-sm text-red-600">{errors.image}</p>}
                        </div>

                        {/* Display added images with remove option */}
                        {data.image.length > 0 && (
                            <div className="space-y-3">
                                <Label>Added Images</Label>
                                {data.image.map((url, index) => (
                                    <div key={index} className="flex items-center gap-2 p-2 border rounded">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <img src={url} alt={`Product ${index + 1}`} className="h-12 w-12 rounded object-cover" />
                                                <span className="text-sm text-gray-600 truncate max-w-xs">{url}</span>
                                            </div>
                                        </div>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => removeImageUrl(index)}
                                            className="text-red-600 hover:text-red-800"
                                        >
                                            Remove
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>



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
                            {processing ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
