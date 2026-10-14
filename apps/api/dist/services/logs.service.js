"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogsService = void 0;
const logs_repository_1 = require("../repositories/logs.repository");
const logsRepo = new logs_repository_1.LogsRepository();
class LogsService {
    async getLogs(params) {
        const page = params.page || 1;
        const limit = params.limit || 10;
        return await logsRepo.findAll({
            ...params,
            page,
            limit,
        });
    }
    async getLogById(id) {
        return await logsRepo.findById(id);
    }
}
exports.LogsService = LogsService;
//# sourceMappingURL=logs.service.js.map