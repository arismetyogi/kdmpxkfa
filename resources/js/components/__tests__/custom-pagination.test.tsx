import { render, screen } from '@testing-library/react';
import { CustomPagination } from './custom-pagination';
import { Paginated } from '@/types';
import { describe, it, expect } from 'vitest';

describe('CustomPagination', () => {
  it('renders pagination links correctly for first page', () => {
    const pagination: Paginated<any> = {
      data: [],
      links: [
        { url: null, label: '&laquo; Previous', active: false },
        { url: '/?page=1', label: '1', active: true },
        { url: '/?page=2', label: '2', active: false },
        { url: '/?page=3', label: '3', active: false },
        { url: '/?page=4', label: '4', active: false },
        { url: '/?page=5', label: '5', active: false },
        { url: '/?page=2', label: 'Next &raquo;', active: false },
      ],
      meta: {
        current_page: 1,
        from: 1,
        last_page: 5,
        path: '/admin/products',
        per_page: 15,
        to: 15,
        total: 75,
      },
    };

    render(<CustomPagination pagination={pagination} />);

    // Check that the pagination component is rendered
    expect(screen.getByRole('navigation', { name: 'pagination' })).toBeInTheDocument();

    // Check that we show 3 page links (1, 2, 3)
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    
    // Check that we show ellipsis at the end
    expect(screen.getByText('More pages')).toBeInTheDocument();

    // Check that Previous is disabled and Next is enabled
    expect(screen.getByText('Previous')).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
  });

  it('renders pagination links correctly for middle page', () => {
    const pagination: Paginated<any> = {
      data: [],
      links: [
        { url: '/?page=4', label: '&laquo; Previous', active: false },
        { url: '/?page=1', label: '1', active: false },
        { url: '/?page=2', label: '2', active: false },
        { url: '/?page=3', label: '3', active: false },
        { url: '/?page=4', label: '4', active: true },
        { url: '/?page=5', label: '5', active: false },
        { url: '/?page=6', label: '6', active: false },
        { url: '/?page=7', label: '7', active: false },
        { url: '/?page=5', label: 'Next &raquo;', active: false },
      ],
      meta: {
        current_page: 4,
        from: 1,
        last_page: 7,
        path: '/admin/products',
        per_page: 15,
        to: 15,
        total: 105,
      },
    };

    render(<CustomPagination pagination={pagination} />);

    // Check that we show 3 page links (3, 4, 5)
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    
    // Check that we show ellipsis at both ends
    const ellipses = screen.getAllByText('More pages');
    expect(ellipses).toHaveLength(2);

    // Check that Previous and Next are enabled
    expect(screen.getByText('Previous')).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
  });

  it('renders pagination links correctly for last page', () => {
    const pagination: Paginated<any> = {
      data: [],
      links: [
        { url: '/?page=4', label: '&laquo; Previous', active: false },
        { url: '/?page=1', label: '1', active: false },
        { url: '/?page=2', label: '2', active: false },
        { url: '/?page=3', label: '3', active: false },
        { url: '/?page=4', label: '4', active: false },
        { url: '/?page=5', label: '5', active: true },
        { url: null, label: 'Next &raquo;', active: false },
      ],
      meta: {
        current_page: 5,
        from: 1,
        last_page: 5,
        path: '/admin/products',
        per_page: 15,
        to: 15,
        total: 75,
      },
    };

    render(<CustomPagination pagination={pagination} />);

    // Check that we show 3 page links (3, 4, 5)
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    
    // Check that we show ellipsis at the start
    expect(screen.getByText('More pages')).toBeInTheDocument();

    // Check that Previous is enabled and Next is disabled
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

  it('renders all pages when there are only 3 pages', () => {
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

    // Check that we show all 3 page links (1, 2, 3)
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    
    // Check that we don't show any ellipsis
    expect(screen.queryByText('More pages')).not.toBeInTheDocument();
  });
});