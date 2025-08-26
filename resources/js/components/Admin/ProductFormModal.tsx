import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectItem } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Category, Product } from '@/types';
import { mockCategories } from '@/data/mockData';

interface ProductFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: Product | null;
    onSubmit?: (product: Partial<Product>) => void;
    categories?: Category[];
}

export default function ProductFormModal({
                                             isOpen,
                                             onClose,
                                             product,
                                             onSubmit,
                                             categories = mockCategories
                                         }: ProductFormModalProps) {
    const [formData, setFormData] = useState<Partial<Product>>({
        name: '',
        sku: '',
        description: '',
        category_id: undefined,
        length: 0,
        width: 0,
        height: 0,
        price: 0,
        is_active: true,
    });

    useEffect(() => {
        if (product) {
            setFormData(product);
        } else {
            setFormData({
                name: '',
                sku: '',
                category_id: undefined,
                length: 0,
                width: 0,
                height: 0,
                description: '',
                price: 0,
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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'category_id' ? (value ? parseInt(value) : undefined) :
                type === 'number' ? parseFloat(value) || 0 :
                    type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
        }));
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="fixed inset-0 bg-black/50" onClick={onClose} />
            <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b">
                    <h2 className="text-lg font-semibold">
                        {product ? 'Edit Product' : 'Create Product'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="name">Product Name</Label>
                            <Input
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="sku">SKU</Label>
                            <Input
                                id="sku"
                                name="sku"
                                value={formData.sku}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="category_id">Category</Label>
                            <Select
                                id="category_id"
                                name="category_id"
                                defaultValue={formData.category_id?.toString() || ''}
                                onValueChange={handleInputChange}
                            >
                                <SelectItem value="">Select Category</SelectItem>
                                {categories.map((category) => (
                                    <SelectItem key={category.id} value={category.id.toString()}>
                                        {category.main_category}
                                        {category.subcategory1 && ` > ${category.subcategory1}`}
                                        {category.subcategory2 && ` > ${category.subcategory2}`}
                                    </SelectItem>
                                ))}
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="price">Price</Label>
                            <Input
                                id="price"
                                name="price"
                                type="number"
                                step="0.01"
                                value={formData.price}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>

                    <div>
                        <Label>Dimensions (cm)</Label>
                        <div className="grid grid-cols-3 gap-2">
                            <Input
                                name="length"
                                type="number"
                                placeholder="Length"
                                value={formData.length}
                                onChange={handleInputChange}
                            />
                            <Input
                                name="width"
                                type="number"
                                placeholder="Width"
                                value={formData.width}
                                onChange={handleInputChange}
                            />
                            <Input
                                name="height"
                                type="number"
                                placeholder="Height"
                                value={formData.height}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            rows={3}
                        />
                    </div>

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

                    <div className="flex justify-end space-x-3 pt-4">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit">
                            {product ? 'Update Product' : 'Create Product'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
