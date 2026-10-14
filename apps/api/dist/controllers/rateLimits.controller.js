"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RateLimitsController = void 0;
const rateLimits_service_1 = require("../services/rateLimits.service");
const rateLimitsService = new rateLimits_service_1.RateLimitsService();
class RateLimitsController {
    async getSummary(req, res, next) {
        try {
            const { from, to } = req.query;
            const summary = await rateLimitsService.getSummary(from, to);
            res.json({ data: summary });
        }
        catch (error) {
            next(error);
        }
    }
    async getViolations(req, res, next) {
        try {
            const { from, to } = req.query;
            const violations = await rateLimitsService.getViolations(from, to);
            res.json({ data: violations });
        }
        catch (error) {
            next(error);
        }
    }
    async getTopOffenders(req, res, next) {
        try {
            const offenders = await rateLimitsService.getTopOffenders();
            res.json({ data: offenders });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.RateLimitsController = RateLimitsController;
//# sourceMappingURL=rateLimits.controller.js.map