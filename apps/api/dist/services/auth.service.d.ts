export declare class AuthService {
    getStats(from?: string, to?: string): Promise<any>;
    getEvents(page: number, limit: number): Promise<{
        events: import("../types").AuthEvent[];
        meta: import("../dto/pagination.dto").PaginationMeta;
    }>;
}
//# sourceMappingURL=auth.service.d.ts.map