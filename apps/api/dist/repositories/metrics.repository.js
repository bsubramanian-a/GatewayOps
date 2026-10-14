"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetricsRepository = void 0;
const database_1 = require("../config/database");
class MetricsRepository {
    async getSummary(from, to) {
        let query = (0, database_1.db)('api_logs');
        if (from && to) {
            query = query.whereBetween('created_at', [from, to]);
        }
        const countResult = await query.clone().count('*').first();
        const totalRequests = countResult.count;
        let failedQuery = (0, database_1.db)('api_logs');
        if (from && to) {
            failedQuery = failedQuery.whereBetween('created_at', [from, to]);
        }
        const failedResult = await failedQuery
            .where('status_code', '>=', 400)
            .count('*')
            .first();
        const failedRequests = failedResult.count;
        const successRate = totalRequests > 0
            ? Math.round((totalRequests - failedRequests) / totalRequests * 100)
            : 100;
        let authFailuresQuery = (0, database_1.db)('auth_events')
            .where('event_type', 'login_failure');
        if (from && to) {
            authFailuresQuery = authFailuresQuery.whereBetween('created_at', [from, to]);
        }
        const authFailures = await authFailuresQuery.count('*').first();
        let latencyQuery = (0, database_1.db)('api_logs');
        if (from && to) {
            latencyQuery = latencyQuery.whereBetween('created_at', [from, to]);
        }
        const latencyResult = await latencyQuery.avg('latency_ms').first();
        const avgResponseTime = Math.round(latencyResult.avg || 0);
        let violationsQuery = (0, database_1.db)('rate_limit_violations');
        if (from && to) {
            violationsQuery = violationsQuery.whereBetween('created_at', [from, to]);
        }
        const violations = await violationsQuery.count('*').first();
        return {
            total_requests: totalRequests,
            failed_requests: failedRequests,
            success_rate: successRate,
            auth_failures: authFailures.count,
            avg_response_time: avgResponseTime,
            rate_limit_violations: violations.count,
        };
    }
    async getRequestsOverTime(interval = 'hour', from, to) {
        const truncInterval = interval === 'day' ? 'day' : 'hour';
        let query = (0, database_1.db)('api_logs')
            .select(database_1.db.raw(`DATE_TRUNC('${truncInterval}', created_at) as timestamp`))
            .count('* as value');
        if (from && to) {
            query = query.whereBetween('created_at', [from, to]);
        }
        const result = await query
            .groupByRaw(`DATE_TRUNC('${truncInterval}', created_at)`)
            .orderBy('timestamp', 'asc');
        return result.map((row) => ({
            timestamp: new Date(row.timestamp).toISOString(),
            value: parseInt(row.value.toString(), 10),
        }));
    }
    async getErrorTrends(from, to) {
        let query = (0, database_1.db)('api_logs')
            .select(database_1.db.raw(`DATE_TRUNC('hour', created_at) as timestamp`))
            .count('* as value')
            .where('status_code', '>=', 400);
        if (from && to) {
            query = query.whereBetween('created_at', [from, to]);
        }
        const result = await query
            .groupByRaw(`DATE_TRUNC('hour', created_at)`)
            .orderBy('timestamp', 'asc');
        return result.map((row) => ({
            timestamp: new Date(row.timestamp).toISOString(),
            value: parseInt(row.value.toString(), 10),
        }));
    }
    async getServiceDistribution(from, to) {
        let query = (0, database_1.db)('api_logs')
            .join('services', 'api_logs.service_id', 'services.id')
            .select('services.name')
            .count('api_logs.id as request_count')
            .groupBy('services.name');
        if (from && to) {
            query = query.whereBetween('api_logs.created_at', [from, to]);
        }
        const results = await query.orderBy('request_count', 'desc');
        const total = results.reduce((sum, r) => sum + (typeof r.request_count === 'string' ? parseInt(r.request_count, 10) : r.request_count), 0);
        return results.map((row) => {
            const count = typeof row.request_count === 'string' ? parseInt(row.request_count, 10) : row.request_count;
            return {
                service: row.name,
                request_count: count,
                percentage: Math.round((count / total) * 100),
            };
        });
    }
    async getDetailedMetrics() {
        const result2xx = await (0, database_1.db)('api_logs')
            .where('status_code', '>=', 200)
            .where('status_code', '<', 300)
            .count('* as count')
            .first();
        const result4xx = await (0, database_1.db)('api_logs')
            .where('status_code', '>=', 400)
            .where('status_code', '<', 500)
            .count('* as count')
            .first();
        const result5xx = await (0, database_1.db)('api_logs')
            .where('status_code', '>=', 500)
            .count('* as count')
            .first();
        const slowest = await (0, database_1.db)('api_logs')
            .select('endpoint')
            .avg('latency_ms as avg_latency')
            .groupBy('endpoint')
            .orderBy('avg_latency', 'desc')
            .first();
        const busiest = await (0, database_1.db)('api_logs')
            .join('services', 'api_logs.service_id', 'services.id')
            .select('services.name')
            .count('api_logs.id as request_count')
            .groupBy('services.id', 'services.name')
            .orderBy('request_count', 'desc')
            .first();
        return {
            total_requests_2xx: result2xx.count,
            total_requests_4xx: result4xx.count,
            total_requests_5xx: result5xx.count,
            peak_rpm: 0,
            slowest_endpoint: {
                endpoint: slowest?.endpoint || '',
                avg_latency: Math.round(slowest?.avg_latency || 0),
            },
            busiest_service: {
                name: busiest?.name || '',
                request_count: parseInt(busiest?.request_count || 0, 10),
            },
        };
    }
}
exports.MetricsRepository = MetricsRepository;
//# sourceMappingURL=metrics.repository.js.map