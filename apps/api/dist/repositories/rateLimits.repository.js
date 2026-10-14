"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RateLimitsRepository = void 0;
const database_1 = require("../config/database");
class RateLimitsRepository {
    async getSummary(from, to) {
        let query = (0, database_1.db)('rate_limit_violations');
        if (from && to) {
            query = query.whereBetween('created_at', [from, to]);
        }
        const totalViolations = await query.clone().count('*').first();
        let requestsQuery = (0, database_1.db)('rate_limit_violations');
        if (from && to) {
            requestsQuery = requestsQuery.whereBetween('window_start', [from, to]);
        }
        const requestsResult = await requestsQuery.sum('request_count').first();
        const totalRequests = requestsResult.sum || 0;
        const windowSeconds = from && to
            ? (new Date(to).getTime() - new Date(from).getTime()) / 1000
            : 3600;
        const totalMinutes = Math.floor(windowSeconds / 60);
        const rpm = totalMinutes > 0 ? Math.floor(totalRequests / totalMinutes) : 0;
        return {
            total_violations: totalViolations.count,
            requests_per_minute: rpm,
            peak_rpm: 0,
        };
    }
    async getViolations(from, to) {
        let query = (0, database_1.db)('rate_limit_violations');
        if (from && to) {
            query = query.whereBetween('created_at', [from, to]);
        }
        return await query.orderBy('created_at', 'desc');
    }
    async getTopOffenders() {
        return await (0, database_1.db)('rate_limit_violations')
            .select('user_id', 'service_id')
            .count('* as violation_count')
            .sum('request_count')
            .groupBy('user_id', 'service_id')
            .orderBy('violation_count', 'desc')
            .limit(10);
    }
}
exports.RateLimitsRepository = RateLimitsRepository;
//# sourceMappingURL=rateLimits.repository.js.map