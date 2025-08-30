import React, { useState } from 'react';
import DeleteProductModal from '@/components/Admin/DeleteProductModal';
import ProductFormModal from '@/components/Admin/ProductFormModal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BreadcrumbItem, Product, Category, Paginated } from '@/types';
import { Edit, PackageX, Plus, Trash2 } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Link } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin',
        href: '/admin',
    },
    {
        title: 'Products',
        href: '/admin/products',
    },
];

interface AdminProductProps {
    products: Paginated<Product>;
    categories: Category[];
}

export default function AdminProducts({ products, categories }: AdminProductProps) {
    const [product, setProduct] = useState<Product[]>([]);

    // Modal states
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

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
        setIsCreateModalOpen(false);
        setIsEditModalOpen(false);
        setIsDeleteModalOpen(false);
        setSelectedProduct(null);
    };

    const handleSubmitProduct = (productData: Partial<Product>) => {
        if (selectedProduct) {
            // Update existing product
            const selectedCategory = categories?.find(c => c.id === productData.category_id);
            setProduct(prev => prev.map(p =>
                p.id === selectedProduct.id
                    ? {
                        ...p,
                        ...productData,
                        category: selectedCategory ?? p.category,
                        updated_at: new Date().toISOString()
                    }
                    : p
            ));
        } else {
            // Create new product
            const selectedCategory = categories?.find(c => c.id === productData.category_id);
            const newProduct: Product = {
                ...productData as Product,
                category: selectedCategory
            };
            setProduct(prev => [...prev, newProduct]);
        }
    };
    const totalActive = products.data.filter((product) => product.is_active).length;
    const totalInactive = products.data.filter((product) => !product.is_active).length;

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

                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{products.data.length}</div>
                            <p className="text-xs text-gray-600">Total products in the system</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Products</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalActive}</div>
                            <p className="text-xs text-gray-600">Total active products</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Inactive Products</CardTitle>
                            <PackageX className="h-4 w-4 text-red-300" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalInactive}</div>
                            <p className="text-xs text-gray-600">Total inactive products</p>
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
                                    <TableHead/>
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
                                        <TableCell>
                                            {product.image_url ? (
                                                <img
                                                    src={product.image_url}
                                                    alt={product.name}
                                                    className="w-16 h-16 object-cover rounded-lg"
                                                />
                                            ) : (
                                                <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center text-xs text-gray-500">
                                                    No Image
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <span className="font-medium">{product.name}</span>
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-sm text-gray-600">{product.sku}</span>
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-sm">
                                                {product.category
                                                    ? `${product.category.main_category}${
                                                        product.category.subcategory1 ? ` > ${product.category.subcategory1}` : ''
                                                    }${
                                                        product.category.subcategory2 ? ` > ${product.category.subcategory2}` : ''
                                                    }`
                                                    : 'No Category'
                                                }
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
                                                className={`text-xs text-white ${
                                                    product.is_active ? 'bg-emerald-500' : 'bg-rose-500'
                                                }`}
                                            >
                                                {product.is_active ? 'active' : 'inactive'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center space-x-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleEditProduct(product)}
                                                >
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
                <div className="flex gap-2">
                    {products.links.map((link, idx) => (
                        <Link
                            key={idx}
                            href={link.url ?? "#"}
                            className={`px-3 py-1 rounded ${
                                link.active
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </div>
            </div>

            {/* Create Product Modal */}
            <ProductFormModal
                isOpen={isCreateModalOpen}
                onClose={closeModals}
                product={null}
                onSubmit={handleSubmitProduct}
                categories={categories}
            />

            {/* Edit Product Modal */}
            <ProductFormModal
                isOpen={isEditModalOpen}
                onClose={closeModals}
                product={selectedProduct}
                onSubmit={handleSubmitProduct}
                categories={categories}
            />

            {/* Delete Product Modal */}
            <DeleteProductModal
                isOpen={isDeleteModalOpen}
                onClose={closeModals}
                product={selectedProduct}
            />
        </AppLayout>
    );
}
