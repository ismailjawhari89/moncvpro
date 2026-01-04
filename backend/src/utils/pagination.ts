
/**
 * Pagination helper for Prisma queries
 */
export const paginate = (page: number = 1, limit: number = 10) => {
    const p = Math.max(1, page);
    const l = Math.max(1, Math.min(100, limit)); // Max 100 per page

    return {
        skip: (p - 1) * l,
        take: l,
    };
};

/**
 * Build pagination metadata for response
 */
export const buildPaginationMetadata = (total: number, page: number, limit: number) => {
    const p = Math.max(1, page);
    const l = Math.max(1, limit);
    const totalPages = Math.ceil(total / l);

    return {
        total,
        totalPages,
        currentPage: p,
        pageSize: l,
        hasNextPage: p < totalPages,
        hasPrevPage: p > 1,
    };
};

/**
 * Cursor-based pagination for high-performance listing
 */
export const cursorPaginate = async <T extends { id: string | number }>(
    model: any,
    args: any,
    cursor?: string | number,
    limit: number = 20
) => {
    const take = Math.min(limit, 100);
    const items = await model.findMany({
        ...args,
        take: take + 1,
        cursor: cursor ? { id: cursor } : undefined,
        skip: cursor ? 1 : 0,
        orderBy: { id: 'asc' },
    });

    const hasNextPage = items.length > take;
    const results = hasNextPage ? items.slice(0, take) : items;
    const nextCursor = hasNextPage ? results[results.length - 1].id : null;

    return {
        items: results,
        nextCursor,
        hasNextPage
    };
};
