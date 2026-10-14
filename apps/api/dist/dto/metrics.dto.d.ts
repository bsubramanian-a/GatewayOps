export interface MetricsSummary {
    total_requests: number;
    failed_requests: number;
    success_rate: number;
    auth_failures: number;
    avg_response_time: number;
    rate_limit_violations: number;
}
export interface TimeSeriesDataPoint {
    timestamp: string;
    value: number;
}
export interface ServiceDistribution {
    service: string;
    request_count: number;
    percentage: number;
}
export interface DetailedMetrics {
    total_requests_2xx: number;
    total_requests_4xx: number;
    total_requests_5xx: number;
    peak_rpm: number;
    slowest_endpoint: {
        endpoint: string;
        avg_latency: number;
    };
    busiest_service: {
        name: string;
        request_count: number;
    };
}
//# sourceMappingURL=metrics.dto.d.ts.map