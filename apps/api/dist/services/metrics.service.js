"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetricsService = void 0;
const redis_1 = __importDefault(require("../config/redis"));
const metrics_repository_1 = require("../repositories/metrics.repository");
const metricsRepo = new metrics_repository_1.MetricsRepository();
class MetricsService {
    async getSummary(from, to) {
        const cacheKey = `metrics:summary`;
        const cached = await redis_1.default.get(cacheKey);
        if (cached) {
            return JSON.parse(cached);
        }
        const summary = await metricsRepo.getSummary(from, to);
        await redis_1.default.setEx(cacheKey, 3600, JSON.stringify(summary));
        return summary;
    }
    async getRequestsOverTime(interval = 'hour', from, to) {
        return await metricsRepo.getRequestsOverTime(interval, from, to);
    }
    async getErrorTrends(from, to) {
        return await metricsRepo.getErrorTrends(from, to);
    }
    async getServiceDistribution(from, to) {
        return await metricsRepo.getServiceDistribution(from, to);
    }
    async getDetailedMetrics() {
        return await metricsRepo.getDetailedMetrics();
    }
}
exports.MetricsService = MetricsService;
//# sourceMappingURL=metrics.service.js.map