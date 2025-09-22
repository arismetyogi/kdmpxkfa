import ProductDeleteModal from '@/components/admin/product-delete-modal';
import ProductFormModal from '@/components/admin/product-form-modal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Category, Paginated, Product } from '@/types';
import { router } from '@inertiajs/react';
import { Edit, PackageX, Plus, Search, Trash2, X } from 'lucide-react';
import React, { useState, useCallback } from 'react';
import ProductShowModal from "@/components/admin/product-show-modal";
import { CustomPagination } from '@/components/custom-pagination';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: route('admin.dashboard'),
    },
    {
        title: 'Products',
        href: route('admin.products.index'),
    },
];

interface AdminProductProps {
    products: Paginated<Product>;
    categories: Category[];
    allProducts: number;
    activeProducts: number;
}

export default function AdminProducts({ products, categories, allProducts, activeProducts }: AdminProductProps) {
    // Modal states
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isShowModalOpen, setIsShowModalOpen] = useState(false);

    // Filter states
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    const handleShowProduct = (product: Product) => {
        setSelectedProduct(product);
        setIsShowModalOpen(true)
    }

    const handleCreateProduct = () => {
        setSelectedProduct(null);
        setIsCreateModalOpen(true);
    };

    const handleEditProduct = (product: Product) => {
        setSelectedProduct(product);
        setIsEditModalOpen(true);
    };

    const handleDeleteProduct = (product: Product) => {
        setSelectedProduct(product);
        setIsDeleteModalOpen(true);
    };

    const closeModals = () => {
        setIsShowModalOpen(false);
        setIsCreateModalOpen(false);
        setIsEditModalOpen(false);
        setIsDeleteModalOpen(false);
        setSelectedProduct(null);
    };

    // Apply filters
    const applyFilters = useCallback(() => {
        const filters: Record<string, string> = {};

        if (searchTerm) filters.search = searchTerm;
        if (selectedCategory) filters.category_id = selectedCategory;
        if (statusFilter) filters.status = statusFilter;

        router.get(route('admin.products.index'), filters, {
            preserveState: true,
            preserveScroll: true,
        });
    }, [searchTerm, selectedCategory, statusFilter]);

    // Clear filters
    const clearFilters = () => {
        setSearchTerm('');
        setSelectedCategory('');
        setStatusFilter('');

        router.get(route('admin.products.index'), {}, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    // Handle Enter key in search input
    const handleSearchKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            applyFilters();
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Product Management</h1>
                        <p className="text-gray-600">Manage product details</p>
                    </div>
                    <Button onClick={handleCreateProduct}>
                        <Plus className="mr-2 h-4 w-4" />
                        Create Product
                    </Button>
                </div>

                {/* Search and Filter Section */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                            {/* Search Input */}
                            <div className="relative">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search products..."
                                    className="pl-8"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onKeyDown={handleSearchKeyDown}
                                />
                            </div>

                            {/* Category Filter */}
                            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Filter by category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((category) => (
                                        <SelectItem key={category.id} value={category.id.toString()}>
                                            {category.main_category}
                                            {category.subcategory1 ? ` > ${category.subcategory1}` : ''}
                                            {category.subcategory2 ? ` > ${category.subcategory2}` : ''}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {/* Status Filter */}
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Filter by status" />
                                </SelectTrigger>
                                <SelectContent>
                                    {/*<SelectItem value="">All Statuses</SelectItem>*/}
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="inactive">Inactive</SelectItem>
                                </SelectContent>
                            </Select>

                            {/* Action Buttons */}
                            <div className="flex space-x-2 max-w-fit ms-auto">
                                <Button onClick={applyFilters} className="w-full">
                                    Apply
                                </Button>
                                <Button variant="outline" onClick={clearFilters}>
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{allProducts}</div>
                            <p className="text-xs text-gray-600">
                                {searchTerm || selectedCategory || statusFilter
                                    ? "Filtered products"
                                    : "Total products in the system"}
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Products</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{activeProducts}</div>
                            <p className="text-xs text-gray-600">
                                {searchTerm || selectedCategory || statusFilter
                                    ? "Filtered active products"
                                    : "Total active products"}
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Inactive Products</CardTitle>
                            <PackageX className="h-4 w-4 text-red-300" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{allProducts - activeProducts}</div>
                            <p className="text-xs text-gray-600">
                                {searchTerm || selectedCategory || statusFilter
                                    ? "Filtered inactive products"
                                    : "Total inactive products"}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Products</CardTitle>
                        <CardDescription>View and manage all products and their details</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead />
                                    <TableHead>Name</TableHead>
                                    <TableHead>SKU ID</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Dimension</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {products.data.map((product) => (
                                    <TableRow key={product.id}>
                                        <TableCell onClick={() => handleShowProduct(product)} className='cursor-pointer'>
                                            {product.image ? (
                                                <img src={product.image} alt={product.name} className="h-16 w-16 rounded-lg object-cover" />
                                            ) : (
                                                <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-gray-200 text-xs text-gray-500">
                                                    No Image
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell onClick={() => handleShowProduct(product)} className='cursor-pointer'>
                                            <span className="font-medium">{product.name}</span>
                                        </TableCell>
                                        <TableCell onClick={() => handleShowProduct(product)} className='cursor-pointer'>
                                            <span className="text-sm text-gray-600">{product.sku}</span>
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-sm">
                                                {product.category
                                                    ? `${product.category.main_category}${
                                                          product.category.subcategory1 ? ` > ${product.category.subcategory1}` : ''
                                                      }${product.category.subcategory2 ? ` > ${product.category.subcategory2}` : ''}`
                                                    : 'No Category'}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-sm text-gray-600">
                                                {product?.length}×{product?.width}×{product?.height} cm
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="secondary"
                                                className={`text-xs text-white ${product.is_active ? 'bg-emerald-500' : 'bg-rose-500'}`}
                                            >
                                                {product.is_active ? 'active' : 'inactive'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center space-x-2">
                                                <Button variant="outline" size="sm" onClick={() => handleEditProduct(product)}>
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="text-red-600 hover:text-red-700"
                                                    onClick={() => handleDeleteProduct(product)}
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
                <CustomPagination pagination={products} />
            </div>

            {/* Show Product Modal */}
            <ProductShowModal
                isOpen={isShowModalOpen}
                onClose={closeModals}
                product={selectedProduct}
            />

            {/* Create Product Modal */}
            <ProductFormModal
                isOpen={isCreateModalOpen}
                onClose={closeModals}
                product={null}
                categories={categories}
            />

            {/* Edit Product Modal */}
            <ProductFormModal
                isOpen={isEditModalOpen}
                onClose={closeModals}
                product={selectedProduct}
                categories={categories}
            />

            {/* Delete Product Modal */}
            <ProductDeleteModal isOpen={isDeleteModalOpen} onClose={closeModals} product={selectedProduct} />
        </AppLayout>
    );
}
