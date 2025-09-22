import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Category } from '@/types';
import { X } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface CategoryFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    category: Category | null;
    onSubmit?: (category: Partial<Category>) => void;
}

export default function CategoryFormModal({ isOpen, onClose, onSubmit, category }: CategoryFormModalProps) {
    const [formData, setFormData] = useState<Partial<Category>>({
        main_category: '',
        subcategory1: '',
        subcategory2: '',
    });

    useEffect(() => {
        if (category) {
            setFormData({
                main_category: category.main_category,
                subcategory1: category.subcategory1 || '',
                subcategory2: category.subcategory2 || '',
            });
        } else {
            setFormData({
                main_category: '',
                subcategory1: '',
                subcategory2: '',
            });
        }
    }, [category]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (onSubmit) {
            onSubmit(formData);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="fixed inset-0 bg-black/50" onClick={onClose} />
            <div className="relative mx-4 max-h-[90vh] w-full max-w-md overflow-y-auto rounded-lg bg-white dark:bg-zinc-700/90 backdrop-blur-lg shadow-xl">
                <div className="flex items-center justify-between border-b p-6">
                    <h2 className="text-lg font-semibold">{category ? 'Edit Category' : 'Create Category'}</h2>
                    <button onClick={onClose} className="text-gray-400 transition-colors hover:text-gray-600">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 p-6">
                    {/* Main Category */}
                    <div>
                        <Label htmlFor="main_category">Main Category *</Label>
                        <Input
                            id="main_category"
                            name="main_category"
                            value={formData.main_category}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    {/* Subcategory 1 */}
                    <div>
                        <Label htmlFor="subcategory1">Subcategory 1</Label>
                        <Input
                            id="subcategory1"
                            name="subcategory1"
                            value={formData.subcategory1}
                            onChange={handleInputChange}
                        />
                    </div>

                    {/* Subcategory 2 */}
                    <div>
                        <Label htmlFor="subcategory2">Subcategory 2</Label>
                        <Input
                            id="subcategory2"
                            name="subcategory2"
                            value={formData.subcategory2}
                            onChange={handleInputChange}
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end space-x-3 pt-4">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit">{category ? 'Update Category' : 'Create Category'}</Button>
                    </div>
                </form>
            </div>
        </div>
    );
}