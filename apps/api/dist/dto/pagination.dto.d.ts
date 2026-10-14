export interface PaginationParams {
    page: number;
    limit: number;
}
export interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
    pages: number;
}
export interface PaginatedResponse<T> {
    data: T[];
    meta: PaginationMeta;
}
//# sourceMappingURL=pagination.dto.d.ts.map