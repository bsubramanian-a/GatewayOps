import { MetricsSummary, TimeSeriesDataPoint, ServiceDistribution, DetailedMetrics } from '../dto/metrics.dto';
export declare class MetricsService {
    getSummary(from?: string, to?: string): Promise<MetricsSummary>;
    getRequestsOverTime(interval?: 'hour' | 'day', from?: string, to?: string): Promise<TimeSeriesDataPoint[]>;
    getErrorTrends(from?: string, to?: string): Promise<TimeSeriesDataPoint[]>;
    getServiceDistribution(from?: string, to?: string): Promise<ServiceDistribution[]>;
    getDetailedMetrics(): Promise<DetailedMetrics>;
}
//# sourceMappingURL=metrics.service.d.ts.map