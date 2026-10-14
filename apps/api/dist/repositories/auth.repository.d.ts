import { AuthEvent } from '../types';
import { PaginationMeta } from '../dto/pagination.dto';
export declare class AuthRepository {
    getStats(from?: string, to?: string): Promise<any>;
    getEvents(page: number, limit: number): Promise<{
        events: AuthEvent[];
        meta: PaginationMeta;
    }>;
}
//# sourceMappingURL=auth.repository.d.ts.map