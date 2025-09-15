import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import { Paginated } from '@/types';
import { router } from '@inertiajs/react';
import { ChevronFirst, ChevronLast } from 'lucide-react';

interface CustomPaginationProps {
    pagination: Paginated<any>;
}

export function CustomPagination({ pagination }: CustomPaginationProps) {
    // Don't render if there's only one page
    if (pagination.links.length <= 3) {
        return null;
    }

    // Remove first and last links (Previous and Next)
    const pageLinks = pagination.links.slice(1, -1);

    // Find the active page index
    const activeIndex = pageLinks.findIndex(link => link.active);

    // Determine which pages to show (5 pages at a time)
    let startPage = 0;
    let endPage = pageLinks.length;

    if (pageLinks.length > 5) {
        if (activeIndex <= 2) {
            // Show first 5 pages
            startPage = 0;
            endPage = 5;
        } else if (activeIndex >= pageLinks.length - 3) {
            // Show last 5 pages
            startPage = pageLinks.length - 5;
            endPage = pageLinks.length;
        } else {
            // Show active page with two pages on each side
            startPage = activeIndex - 2;
            endPage = activeIndex + 3;
        }
    }

    const visiblePages = pageLinks.slice(startPage, endPage);

    // Handle pagination navigation with preserved state and scroll
    const handlePageChange = (url: string | null) => {
        if (url) {
            router.get(url, {}, {
                preserveState: true,
                preserveScroll: true,
            });
        }
    };

    // Get first and last page links
    const firstPageLink = pageLinks[0];
    const lastPageLink = pageLinks[pageLinks.length - 1];

    return (
        <Pagination>
            <PaginationContent>
                {/* First page button */}
                {pageLinks.length > 5 && firstPageLink && (
                    <PaginationItem>
                        <button
                            onClick={() => handlePageChange(firstPageLink.url)}
                            disabled={!firstPageLink.url || firstPageLink.active}
                            className={firstPageLink.active ? "cursor-default" : ""}
                        >
                            <PaginationLink isActive={false} size="default">
                                <ChevronFirst/>
                            </PaginationLink>
                        </button>
                    </PaginationItem>
                )}

                {/* Previous button */}
                {pagination.links[0].url && (
                    <PaginationItem>
                        <button
                            onClick={() => handlePageChange(pagination.links[0].url)}
                            disabled={!pagination.links[0].url}
                        >
                            <PaginationPrevious size="default" />
                        </button>
                    </PaginationItem>
                )}

                {/* Show ellipsis at the start if needed */}
                {startPage > 0 && (
                    <PaginationItem>
                        <PaginationEllipsis />
                    </PaginationItem>
                )}

                {/* Page links */}
                {visiblePages.map((link, index) => (
                    <PaginationItem key={startPage + index}>
                        {link.url ? (
                            <button
                                onClick={() => handlePageChange(link.url)}
                                disabled={link.active}
                                className={link.active ? "cursor-default" : ""}
                            >
                                <PaginationLink isActive={link.active} size={undefined}>
                                    {link.label.replace('&laquo;', '').replace('&raquo;', '').trim()}
                                </PaginationLink>
                            </button>
                        ) : (
                            <PaginationLink className="pointer-events-none" size={undefined}>
                                {link.label.replace('&laquo;', '').replace('&raquo;', '').trim()}
                            </PaginationLink>
                        )}
                    </PaginationItem>
                ))}

                {/* Show ellipsis at the end if needed */}
                {endPage < pageLinks.length && (
                    <PaginationItem>
                        <PaginationEllipsis />
                    </PaginationItem>
                )}

                {/* Next button */}
                {pagination.links[pagination.links.length - 1].url && (
                    <PaginationItem>
                        <button
                            onClick={() => handlePageChange(pagination.links[pagination.links.length - 1].url)}
                            disabled={!pagination.links[pagination.links.length - 1].url}
                        >
                            <PaginationNext size="default" />
                        </button>
                    </PaginationItem>
                )}

                {/* Last page button */}
                {pageLinks.length > 5 && lastPageLink && (
                    <PaginationItem>
                        <button
                            onClick={() => handlePageChange(lastPageLink.url)}
                            disabled={!lastPageLink.url || lastPageLink.active}
                            className={lastPageLink.active ? "cursor-default" : ""}
                        >
                            <PaginationLink isActive={false} size={undefined}>
                                <ChevronLast/>
                            </PaginationLink>
                        </button>
                    </PaginationItem>
                )}
            </PaginationContent>
        </Pagination>
    );
}
