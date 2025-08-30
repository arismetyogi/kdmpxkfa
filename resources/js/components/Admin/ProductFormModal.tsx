import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Category, Product } from '@/types';
import { X } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface ProductFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: Product | null;
    onSubmit?: (product: Partial<Product>) => void;
    categories?: Category[];
}

export default function ProductFormModal({ isOpen, onClose, product, onSubmit, categories = [] }: ProductFormModalProps) {
    const [formData, setFormData] = useState<Partial<Product>>({
        name: '',
        sku: '',
        description: '',
        dosage: [],
        pharmacology: '',
        category_id: undefined,
        base_uom: '',
        order_unit: '',
        content: 1,
        brand: '',
        length: 0,
        width: 0,
        height: 0,
        weight: 0,
        price: 0,
        image_url: '',
        image_alt: '',
        is_active: true,
    });

    useEffect(() => {
        if (product) {
            setFormData(product);
        } else {
            setFormData({
                name: '',
                sku: '',
                description: '',
                dosage: [],
                pharmacology: '',
                category_id: undefined,
                base_uom: '',
                order_unit: '',
                content: 1,
                brand: '',
                length: 0,
                width: 0,
                height: 0,
                weight: 0,
                price: 0,
                image_url: '',
                image_alt: '',
                is_active: true,
            });
        }
    }, [product]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (onSubmit) {
            onSubmit(formData);
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

    // handle category select (since ShadCN Select doesn’t give a real event)
    const handleCategoryChange = (value: string) => {
        setFormData((prev) => ({
            ...prev,
            category_id: value ? parseInt(value) : undefined,
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
            <div className="fixed inset-0 bg-black/50" onClick={onClose} />
            <div className="relative mx-4 max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg bg-white shadow-xl">
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
                            <Input id="brand" name="brand" value={formData.brand} onChange={handleInputChange} />
                        </div>
                        <div>
                            <Label htmlFor="category_id">Category</Label>
                            <Select defaultValue={formData.category_id?.toString() || ''} onValueChange={handleCategoryChange}>
                                <SelectContent>
                                    {categories.map((category) => (
                                        <SelectItem key={category.id} value={category.id.toString()}>
                                            {category.main_category}
                                            {category.subcategory1 && ` > ${category.subcategory1}`}
                                            {category.subcategory2 && ` > ${category.subcategory2}`}
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
                            <Input id="price" name="price" type="number" step="0.01" value={formData.price} onChange={handleInputChange} />
                        </div>
                        <div>
                            <Label htmlFor="base_uom">Base UOM</Label>
                            <Input id="base_uom" name="base_uom" value={formData.base_uom} onChange={handleInputChange} />
                        </div>
                        <div>
                            <Label htmlFor="order_unit">Order Unit</Label>
                            <Input id="order_unit" name="order_unit" value={formData.order_unit} onChange={handleInputChange} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="content">Content</Label>
                            <Input id="content" name="content" type="number" value={formData.content} onChange={handleInputChange} />
                        </div>
                        <div>
                            <Label htmlFor="weight">Weight (g)</Label>
                            <Input id="weight" name="weight" type="number" value={formData.weight} onChange={handleInputChange} />
                        </div>
                    </div>

                    {/* Dimensions */}
                    <div>
                        <Label>Dimensions (cm)</Label>
                        <div className="grid grid-cols-3 gap-2">
                            <Input name="length" type="number" placeholder="Length" value={formData.length} onChange={handleInputChange} />
                            <Input name="width" type="number" placeholder="Width" value={formData.width} onChange={handleInputChange} />
                            <Input name="height" type="number" placeholder="Height" value={formData.height} onChange={handleInputChange} />
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
                            <Label htmlFor="image_url">Image URL</Label>
                            <Input id="image_url" name="image_url" value={formData.image_url} onChange={handleInputChange} />
                        </div>
                        <div>
                            <Label htmlFor="image_alt">Image Alt</Label>
                            <Input id="image_alt" name="image_alt" value={formData.image_alt} onChange={handleInputChange} />
                        </div>
                    </div>

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
