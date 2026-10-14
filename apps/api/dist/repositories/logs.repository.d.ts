import { ApiLog } from '../types';
import { LogsQueryParams } from '../dto/logs.dto';
import { PaginationMeta } from '../dto/pagination.dto';
export declare class LogsRepository {
    findAll(params: LogsQueryParams & {
        page: number;
        limit: number;
    }): Promise<{
        logs: ApiLog[];
        meta: PaginationMeta;
    }>;
    findById(id: string): Promise<ApiLog | null>;
}
//# sourceMappingURL=logs.repository.d.ts.map