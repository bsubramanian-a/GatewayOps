"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServicesRepository = void 0;
const database_1 = require("../config/database");
class ServicesRepository {
    async findAll() {
        return await (0, database_1.db)('services').orderBy('created_at', 'desc');
    }
    async findBySlug(slug) {
        return await (0, database_1.db)('services').where('slug', slug).first();
    }
    async getStats(serviceId) {
        const totalRequests = await (0, database_1.db)('api_logs')
            .where('service_id', serviceId)
            .count('*')
            .first();
        const errorRequests = await (0, database_1.db)('api_logs')
            .where('service_id', serviceId)
            .whereRaw('status_code >= 400')
            .count('*')
            .first();
        const avgLatency = await (0, database_1.db)('api_logs')
            .where('service_id', serviceId)
            .avg('latency_ms')
            .first();
        return {
            request_count: totalRequests.count,
            error_count: errorRequests.count,
            error_rate: totalRequests.count > 0
                ? Math.round((errorRequests.count / totalRequests.count) * 100)
                : 0,
            avg_latency: Math.round(avgLatency.avg || 0),
        };
    }
}
exports.ServicesRepository = ServicesRepository;
//# sourceMappingURL=services.repository.js.map