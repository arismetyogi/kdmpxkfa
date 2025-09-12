import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import AdminProducts from '@/pages/admin/products';

// Mock Inertia router
vi.mock('@inertiajs/react', () => ({
  Link: ({ children, ...props }: any) => <a {...props}>{children}</a>,
  router: {
    get: vi.fn(),
  },
}));

// Mock route helper
vi.mock('@/lib/router', () => ({
  route: vi.fn((name: string) => `/${name.replace(/\./g, '/')}`),
}));

describe('AdminProducts', () => {
  const mockProps = {
    products: {
      data: [
        {
          id: 1,
          sku: 'SKU001',
          name: 'Product 1',
          slug: 'product-1',
          description: 'Description 1',
          dosage: [],
          pharmacology: null,
          category_id: 1,
          category: {
            id: 1,
            main_category: 'Category 1',
            subcategory1: null,
            subcategory2: null,
          },
          base_uom: 'PCS',
          order_unit: 'BOX',
          content: 10,
          price: 10000,
          weight: 100,
          length: 10,
          width: 10,
          height: 10,
          brand: 'Brand 1',
          image: null,
          is_active: true,
          is_featured: false,
        },
      ],
      links: [
        { url: null, label: '&laquo; Previous', active: false },
        { url: '/?page=1', label: '1', active: true },
        { url: '/?page=2', label: '2', active: false },
        { url: '/?page=2', label: 'Next &raquo;', active: false },
      ],
      meta: {
        current_page: 1,
        from: 1,
        last_page: 2,
        path: '/admin/products',
        per_page: 15,
        to: 15,
        total: 20,
      },
    },
    categories: [
      {
        id: 1,
        main_category: 'Category 1',
        subcategory1: null,
        subcategory2: null,
      },
    ],
    allProducts: 20,
    activeProducts: 18,
  };

  it('renders the products page correctly', () => {
    render(<AdminProducts {...mockProps} />);

    // Check that the main title is rendered
    expect(screen.getByText('Product Management')).toBeInTheDocument();

    // Check that the product table is rendered
    expect(screen.getByText('Product 1')).toBeInTheDocument();

    // Check that statistics cards are rendered
    expect(screen.getByText('20')).toBeInTheDocument(); // Total products
    expect(screen.getByText('18')).toBeInTheDocument(); // Active products
    expect(screen.getByText('2')).toBeInTheDocument(); // Inactive products

    // Check that the pagination component is rendered
    expect(screen.getByRole('navigation', { name: 'pagination' })).toBeInTheDocument();
  });

  it('renders correctly with no products', () => {
    const emptyProps = {
      ...mockProps,
      products: {
        ...mockProps.products,
        data: [],
        links: [
          { url: null, label: '&laquo; Previous', active: false },
          { url: '/?page=1', label: '1', active: true },
          { url: null, label: 'Next &raquo;', active: false },
        ],
        meta: {
          ...mockProps.products.meta,
          total: 0,
          last_page: 1,
        },
      },
      allProducts: 0,
      activeProducts: 0,
    };

    render(<AdminProducts {...emptyProps} />);

    // Check that statistics are updated
    expect(screen.getByText('0')).toBeInTheDocument(); // Total products
    expect(screen.getByText('0')).toBeInTheDocument(); // Active products
    expect(screen.getByText('0')).toBeInTheDocument(); // Inactive products
  });
});