"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogsRepository = void 0;
const database_1 = require("../config/database");
class LogsRepository {
    async findAll(params) {
        const { page, limit, service, statusCode, from, to, search } = params;
        let query = (0, database_1.db)('api_logs');
        if (service) {
            const serviceRecord = await (0, database_1.db)('services').where('slug', service).first();
            if (serviceRecord) {
                query = query.where('service_id', serviceRecord.id);
            }
        }
        if (statusCode) {
            query = query.orWhere('status_code', statusCode);
        }
        if (from && to) {
            query = query.whereBetween('created_at', [from, to]);
        }
        if (search) {
            query = query.where('endpoint', 'like', `%${search}%`);
        }
        const total = await query.clone().count('* as count').first();
        const offset = page * limit;
        const logs = await query
            .orderBy('created_at', 'desc')
            .limit(limit)
            .offset(offset);
        for (const log of logs) {
            const service = await (0, database_1.db)('services').where('id', log.service_id).first();
            log.service_name = service?.name;
        }
        return {
            logs: logs,
            meta: {
                page,
                limit,
                total: total.count,
                pages: Math.ceil(total.count / limit),
            },
        };
    }
    async findById(id) {
        return await (0, database_1.db)('api_logs').where('id', id).first();
    }
}
exports.LogsRepository = LogsRepository;
//# sourceMappingURL=logs.repository.js.map