import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Category, Product } from '@/types';
import { X } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface ProductFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: Product | null;
    onSubmit?: (product: Partial<Product>) => void;
    categories: Category[];
}

export default function ProductFormModal({ isOpen, onClose, onSubmit, product, categories }: ProductFormModalProps) {
    const [formData, setFormData] = useState<Omit<Partial<Product>, 'category_id'> & {category_id?: string; image?: string | File }>({
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
        image: '',
        is_active: true,
    });

    const [imagePreview, setImagePreview] = useState<string | null>(null);

    useEffect(() => {
        if (product) {
            setFormData({
                ...product,
                category_id: product.category_id?.toString() ?? undefined, // ensure string or undefined
                image: product.image ?? '', // keep string (URL) from MediaLibrary);
            });
            // Set image preview if product has an image
            if (typeof product.image === 'string' && product.image !== '') {
                setImagePreview(product.image);
            }
        } else {
            setFormData({
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
                image: '',
                is_active: true,
            });
            setImagePreview(null);
        }
    }, [product]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (onSubmit) {
            onSubmit({
                ...formData,
                category_id: formData.category_id ? parseInt(formData.category_id) : undefined,
            });
        }
        onClose();
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]:
                name === 'category_id'
                    ? value
                        ? parseInt(value)
                        : undefined
                    : type === 'number'
                      ? parseFloat(value) || 0
                      : type === 'checkbox'
                        ? (e.target as HTMLInputElement).checked
                        : value,
        }));
    };

    // handle image file input
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData((prev) => ({
                ...prev,
                image: file,
            }));

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
        setFormData((prev) => ({
            ...prev,
            category_id: value,
        }));
    };

    // handle dosage (array of strings) → store as comma-separated input
    const handleDosageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setFormData((prev) => ({
            ...prev,
            dosage: value
                .split(',')
                .map((d) => d.trim())
                .filter(Boolean),
        }));
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
                            <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required />
                        </div>
                        <div>
                            <Label htmlFor="sku">SKU</Label>
                            <Input id="sku" name="sku" value={formData.sku} onChange={handleInputChange} required />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="brand">Brand</Label>
                            <Input id="brand" name="brand" value={formData.brand} onChange={handleInputChange} required />
                        </div>
                        <div>
                            <Label htmlFor="category_id">Category</Label>
                            <Select value={formData.category_id} onValueChange={handleCategoryChange}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((cat) => (
                                        <SelectItem key={cat.id} value={cat.id.toString()}>
                                            {cat.main_category}
                                            {cat.subcategory1 && ` > ${cat.subcategory1}`}
                                            {cat.subcategory2 && ` > ${cat.subcategory2}`}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Pricing & Units */}
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <Label htmlFor="price">Price</Label>
                            <Input id="price" name="price" type="number" step="0.01" value={formData.price} onChange={handleInputChange} required />
                        </div>
                        <div>
                            <Label htmlFor="base_uom">Base UOM</Label>
                            <Input id="base_uom" name="base_uom" value={formData.base_uom} onChange={handleInputChange} required />
                        </div>
                        <div>
                            <Label htmlFor="order_unit">Order Unit</Label>
                            <Input id="order_unit" name="order_unit" value={formData.order_unit} onChange={handleInputChange} required />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="content">Content</Label>
                            <Input id="content" name="content" type="number" value={formData.content} onChange={handleInputChange} required />
                        </div>
                        <div>
                            <Label htmlFor="weight">Weight (g)</Label>
                            <Input id="weight" name="weight" type="number" value={formData.weight} onChange={handleInputChange} required />
                        </div>
                    </div>

                    {/* Dimensions */}
                    <div>
                        <Label>Dimensions (cm)</Label>
                        <div className="grid grid-cols-3 gap-2">
                            <Input name="length" type="number" placeholder="Length" value={formData.length} onChange={handleInputChange} required />
                            <Input name="width" type="number" placeholder="Width" value={formData.width} onChange={handleInputChange} required />
                            <Input name="height" type="number" placeholder="Height" value={formData.height} onChange={handleInputChange} required />
                        </div>
                    </div>

                    {/* Pharmacology & Dosage */}
                    <div>
                        <Label htmlFor="pharmacology">Pharmacology</Label>
                        <Textarea id="pharmacology" name="pharmacology" value={formData.pharmacology} onChange={handleInputChange} rows={2} />
                    </div>
                    <div>
                        <Label htmlFor="dosage">Dosage (comma-separated)</Label>
                        <Input id="dosage" name="dosage" value={formData.dosage?.join(', ') || ''} onChange={handleDosageChange} />
                    </div>

                    {/* Description */}
                    <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" name="description" value={formData.description} onChange={handleInputChange} rows={3} />
                    </div>

                    {/* Image */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="image">Product Image</Label>
                            <Input id="image" name="image" type="file" accept="image/*" onChange={handleImageChange} />
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
                            checked={formData.is_active}
                            onChange={handleInputChange}
                            className="rounded border-gray-300"
                        />
                        <Label htmlFor="is_active">Active Product</Label>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end space-x-3 pt-4">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit">{product ? 'Update Product' : 'Create Product'}</Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
