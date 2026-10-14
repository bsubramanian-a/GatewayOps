import { LogsQueryParams } from '../dto/logs.dto';
export declare class LogsService {
    getLogs(params: LogsQueryParams): Promise<{
        logs: import("../types").ApiLog[];
        meta: import("../dto/pagination.dto").PaginationMeta;
    }>;
    getLogById(id: string): Promise<import("../types").ApiLog | null>;
}
//# sourceMappingURL=logs.service.d.ts.map