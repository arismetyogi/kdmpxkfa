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
import { Link } from '@inertiajs/react';

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

    return (
        <Pagination>
            <PaginationContent>
                {pagination.links[0].url && (
                    <PaginationItem>
                        <Link href={pagination.links[0].url}>
                            <PaginationPrevious size="default"/>
                        </Link>
                    </PaginationItem>
                )}
                <PaginationItem>
                    <PaginationLink href="#">1</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink href="#" isActive>
                        2
                    </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink href="#">3</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                    <PaginationEllipsis />
                </PaginationItem>
                {pagination.links[pagination.links.length - 1].url && (
                    <PaginationItem>
                        <Link href={pagination.links[pagination.links.length - 1].url}>
                            <PaginationNext size="default"/>
                        </Link>
                    </PaginationItem>
                )}
            </PaginationContent>
        </Pagination>
    );
}
