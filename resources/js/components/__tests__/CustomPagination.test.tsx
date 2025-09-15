import { render, screen } from '@testing-library/react';
import { CustomPagination } from '@/components/custom-pagination';
import { Paginated } from '@/types';
import { describe, it, expect } from 'vitest';

describe('CustomPagination', () => {
  it('renders pagination links correctly', () => {
    const pagination: Paginated<any> = {
      data: [],
      links: [
        { url: null, label: '&laquo; Previous', active: false },
        { url: '/?page=1', label: '1', active: true },
        { url: '/?page=2', label: '2', active: false },
        { url: '/?page=3', label: '3', active: false },
        { url: '/?page=2', label: 'Next &raquo;', active: false },
      ],
      meta: {
        current_page: 1,
        from: 1,
        last_page: 3,
        path: '/admin/products',
        per_page: 15,
        to: 15,
        total: 45,
      },
    };

    render(<CustomPagination pagination={pagination} />);

    // Check that the pagination component is rendered
    expect(screen.getByRole('navigation', { name: 'pagination' })).toBeInTheDocument();

    // Check that page links are rendered
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();

    // Check that Previous and Next buttons are rendered
    expect(screen.getByText('Previous')).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
  });

  it('does not render when there is only one page', () => {
    const pagination: Paginated<any> = {
      data: [],
      links: [
        { url: null, label: '&laquo; Previous', active: false },
        { url: '/?page=1', label: '1', active: true },
        { url: null, label: 'Next &raquo;', active: false },
      ],
      meta: {
        current_page: 1,
        from: 1,
        last_page: 1,
        path: '/admin/products',
        per_page: 15,
        to: 15,
        total: 10,
      },
    };

    const { container } = render(<CustomPagination pagination={pagination} />);

    // Check that the pagination component is not rendered
    expect(container.firstChild).toBeNull();
  });

  it('handles disabled links correctly', () => {
    const pagination: Paginated<any> = {
      data: [],
      links: [
        { url: null, label: '&laquo; Previous', active: false },
        { url: '/?page=1', label: '1', active: true },
        { url: null, label: '2', active: false },
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
    };

    render(<CustomPagination pagination={pagination} />);

    // Check that disabled links don't have href attributes
    const disabledLinks = screen.getAllByRole('link', { hidden: true });
    const disabledLink = disabledLinks.find(link => link.textContent === '2');
    expect(disabledLink).toBeInTheDocument();
    expect(disabledLink).not.toHaveAttribute('href');
  });
});
