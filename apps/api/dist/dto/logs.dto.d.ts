import { ApiLog } from '../types';
export interface LogsQueryParams {
    page?: number;
    limit?: number;
    service?: string;
    statusCode?: number;
    from?: string;
    to?: string;
    search?: string;
}
export interface LogResponse extends ApiLog {
    service_name?: string;
}
//# sourceMappingURL=logs.dto.d.ts.map