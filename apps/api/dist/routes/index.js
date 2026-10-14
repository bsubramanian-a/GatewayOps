"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const metrics_routes_1 = __importDefault(require("./metrics.routes"));
const logs_routes_1 = __importDefault(require("./logs.routes"));
const services_routes_1 = __importDefault(require("./services.routes"));
const rateLimits_routes_1 = __importDefault(require("./rateLimits.routes"));
const auth_routes_1 = __importDefault(require("./auth.routes"));
const router = (0, express_1.Router)();
router.use('/metrics', metrics_routes_1.default);
router.use('/logs', logs_routes_1.default);
router.use('/services', services_routes_1.default);
router.use('/rate-limits', rateLimits_routes_1.default);
router.use('/auth', auth_routes_1.default);
router.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        db: 'connected',
        redis: 'connected',
    });
});
exports.default = router;
//# sourceMappingURL=index.js.map