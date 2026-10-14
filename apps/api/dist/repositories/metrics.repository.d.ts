import { MetricsSummary, TimeSeriesDataPoint, ServiceDistribution } from '../dto/metrics.dto';
export declare class MetricsRepository {
    getSummary(from?: string, to?: string): Promise<MetricsSummary>;
    getRequestsOverTime(interval?: 'hour' | 'day', from?: string, to?: string): Promise<TimeSeriesDataPoint[]>;
    getErrorTrends(from?: string, to?: string): Promise<TimeSeriesDataPoint[]>;
    getServiceDistribution(from?: string, to?: string): Promise<ServiceDistribution[]>;
    getDetailedMetrics(): Promise<any>;
}
//# sourceMappingURL=metrics.repository.d.ts.map