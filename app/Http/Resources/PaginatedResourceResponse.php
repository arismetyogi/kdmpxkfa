<?php

namespace App\Http\Resources;

use Illuminate\Pagination\LengthAwarePaginator;

class PaginatedResourceResponse
{
    /**
     * Transform a paginator with a resource into a proper paginated response.
     */
    public static function make(LengthAwarePaginator $paginator, string $resourceClass): array
    {
        return [
            'data' => $paginator->getCollection()->map(fn ($item) => (new $resourceClass($item))->toArray(request())
            ),
            'links' => $paginator->linkCollection(),
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
                'from' => $paginator->firstItem(),
                'to' => $paginator->lastItem(),
            ],
        ];
    }
}
