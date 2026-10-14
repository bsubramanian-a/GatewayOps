"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RateLimitsService = void 0;
const rateLimits_repository_1 = require("../repositories/rateLimits.repository");
const rateLimitsRepo = new rateLimits_repository_1.RateLimitsRepository();
class RateLimitsService {
    async getSummary(from, to) {
        return await rateLimitsRepo.getSummary(from, to);
    }
    async getViolations(from, to) {
        return await rateLimitsRepo.getViolations(from, to);
    }
    async getTopOffenders() {
        return await rateLimitsRepo.getTopOffenders();
    }
}
exports.RateLimitsService = RateLimitsService;
//# sourceMappingURL=rateLimits.service.js.map