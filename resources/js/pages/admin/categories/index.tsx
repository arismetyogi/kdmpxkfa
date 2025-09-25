import CategoryDeleteModal from '@/components/admin/category-delete-modal';
import CategoryFormModal from '@/components/admin/category-form-modal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Category, Paginated } from '@/types';
import { Link, router } from '@inertiajs/react';
import { Edit, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: route('admin.dashboard'),
    },
    {
        title: 'Categories',
        href: route('admin.categories.index'),
    },
];

interface AdminCategoryProps {
    categories: Paginated<Category>;
}

export default function AdminCategories({ categories }: AdminCategoryProps) {
    // Modal states
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

    const handleCreateCategory = () => {
        setSelectedCategory(null);
        setIsCreateModalOpen(true);
    };

    const handleEditCategory = (category: Category) => {
        setSelectedCategory(category);
        setIsEditModalOpen(true);
    };

    const handleDeleteCategory = (category: Category) => {
        setSelectedCategory(category);
        setIsDeleteModalOpen(true);
    };

    const closeModals = () => {
        setIsCreateModalOpen(false);
        setIsEditModalOpen(false);
        setIsDeleteModalOpen(false);
        setSelectedCategory(null);
    };

    const handleSubmitCategory = (categoryData: Partial<Category>) => {
        const payload = {
            main_category: categoryData.main_category,
            subcategory1: categoryData.subcategory1,
            subcategory2: categoryData.subcategory2,
        };

        if (selectedCategory) {
            // Update existing category
            router.put(route('admin.categories.update', selectedCategory.id), payload, {
                onSuccess: () => closeModals(),
            });
        } else {
            // Create new category
            router.post(route('admin.categories.store'), payload, {
                onSuccess: () => closeModals(),
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Category Management</h1>
                        <p className="text-gray-600">Manage product categories</p>
                    </div>
                    <Button onClick={handleCreateCategory}>
                        <Plus className="mr-2 h-4 w-4" />
                        Create Category
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Categories</CardTitle>
                        <CardDescription>View and manage all product categories</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>ID</TableHead>
                                    <TableHead>Main Category</TableHead>
                                    <TableHead>Subcategory 1</TableHead>
                                    <TableHead>Subcategory 2</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {categories.data.map((category) => (
                                    <TableRow key={category.id}>
                                        <TableCell>{category.id}</TableCell>
                                        <TableCell>
                                            <span className="font-medium">{category.main_category}</span>
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-sm text-gray-600">{category.subcategory1 || '-'}</span>
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-sm text-gray-600">{category.subcategory2 || '-'}</span>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center space-x-2">
                                                <Button variant="outline" size="sm" onClick={() => handleEditCategory(category)}>
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="text-red-600 hover:text-red-700"
                                                    onClick={() => handleDeleteCategory(category)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
                {/* Pagination */}
                <div className="flex gap-2">
                    {categories.links.map((link, idx) => (
                        <Link
                            key={idx}
                            href={link.url ?? '#'}
                            className={`rounded px-3 py-1 ${link.active ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </div>
            </div>

            {/* Create Category Modal */}
            <CategoryFormModal isOpen={isCreateModalOpen} onClose={closeModals} category={null} onSubmit={handleSubmitCategory} />

            {/* Edit Category Modal */}
            <CategoryFormModal isOpen={isEditModalOpen} onClose={closeModals} category={selectedCategory} onSubmit={handleSubmitCategory} />

            {/* Delete Category Modal */}
            <CategoryDeleteModal isOpen={isDeleteModalOpen} onClose={closeModals} category={selectedCategory} />
        </AppLayout>
    );
}
