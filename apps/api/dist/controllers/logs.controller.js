"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogsController = void 0;
const logs_service_1 = require("../services/logs.service");
const logsService = new logs_service_1.LogsService();
class LogsController {
    async findAll(req, res, next) {
        try {
            const { page = '1', limit = '10', service, statusCode, from, to, search, } = req.query;
            const result = await logsService.getLogs({
                page: parseInt(page, 10),
                limit: parseInt(limit, 10),
                service,
                statusCode: statusCode ? parseInt(statusCode, 10) : undefined,
                from,
                to,
                search,
            });
            res.json(result);
        }
        catch (error) {
            next(error);
        }
    }
    async findOne(req, res, next) {
        try {
            const { id } = req.params;
            const log = await logsService.getLogById(id);
            res.json({ data: log });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.LogsController = LogsController;
//# sourceMappingURL=logs.controller.js.map