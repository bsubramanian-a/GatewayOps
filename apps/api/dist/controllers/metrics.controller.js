"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetricsController = void 0;
const metrics_service_1 = require("../services/metrics.service");
const metricsService = new metrics_service_1.MetricsService();
class MetricsController {
    async getSummary(req, res, next) {
        try {
            const { from, to } = req.query;
            const summary = await metricsService.getSummary(from, to);
            res.json({ data: summary });
        }
        catch (error) {
            next(error);
        }
    }
    async getRequestsOverTime(req, res, next) {
        try {
            const { interval, from, to } = req.query;
            const data = await metricsService.getRequestsOverTime(interval || 'hour', from, to);
            res.json({ data });
        }
        catch (error) {
            next(error);
        }
    }
    async getErrorTrends(req, res, next) {
        try {
            const { from, to } = req.query;
            const data = await metricsService.getErrorTrends(from, to);
            res.json({ data });
        }
        catch (error) {
            next(error);
        }
    }
    async getServiceDistribution(req, res, next) {
        try {
            const { from, to } = req.query;
            const data = await metricsService.getServiceDistribution(from, to);
            res.json({ data });
        }
        catch (error) {
            next(error);
        }
    }
    async getDetailedMetrics(req, res, next) {
        try {
            const data = await metricsService.getDetailedMetrics();
            res.json({ data });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.MetricsController = MetricsController;
//# sourceMappingURL=metrics.controller.js.map