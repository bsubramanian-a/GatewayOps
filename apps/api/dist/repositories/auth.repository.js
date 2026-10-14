"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRepository = void 0;
const database_1 = require("../config/database");
class AuthRepository {
    async getStats(from, to) {
        let successQuery = (0, database_1.db)('auth_events').where('event_type', 'login_success');
        if (from && to) {
            successQuery = successQuery.whereBetween('created_at', [from, to]);
        }
        const successResult = await successQuery.count('*').first();
        let failureQuery = (0, database_1.db)('auth_events').where('event_type', 'login_failure');
        if (from && to) {
            failureQuery = failureQuery.whereBetween('created_at', [from, to]);
        }
        const failureResult = await failureQuery.count('*').first();
        let invalidQuery = (0, database_1.db)('auth_events').where('event_type', 'token_invalid');
        if (from && to) {
            invalidQuery = invalidQuery.whereBetween('created_at', [from, to]);
        }
        const invalidResult = await invalidQuery.count('*').first();
        let expiredQuery = (0, database_1.db)('auth_events').where('event_type', 'token_expired');
        if (from && to) {
            expiredQuery = expiredQuery.whereBetween('created_at', [from, to]);
        }
        const expiredResult = await expiredQuery.count('*').first();
        return {
            successful_logins: successResult.count,
            failed_logins: failureResult.count,
            token_invalid: invalidResult.count,
            token_expired: expiredResult.count,
        };
    }
    async getEvents(page, limit) {
        const offset = (page - 1) * limit;
        const total = await (0, database_1.db)('auth_events').count('*').first();
        const events = await (0, database_1.db)('auth_events')
            .orderBy('created_at', 'desc')
            .limit(limit)
            .offset(offset);
        return {
            events: events,
            meta: {
                page,
                limit,
                total: total.count,
                pages: Math.ceil(total.count / limit),
            },
        };
    }
}
exports.AuthRepository = AuthRepository;
//# sourceMappingURL=auth.repository.js.map