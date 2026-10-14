"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const roleGuard_1 = require("../middleware/roleGuard");
const metrics_controller_1 = require("../controllers/metrics.controller");
const router = (0, express_1.Router)();
const controller = new metrics_controller_1.MetricsController();
router.get('/summary', (req, res, next) => controller.getSummary(req, res, next));
router.get('/requests-over-time', (req, res, next) => controller.getRequestsOverTime(req, res, next));
router.get('/error-trends', (req, res, next) => controller.getErrorTrends(req, res, next));
router.get('/service-distribution', (req, res, next) => controller.getServiceDistribution(req, res, next));
router.get('/admin/detailed', (req, res, next) => controller.getDetailedMetrics(req, res, next), (0, roleGuard_1.roleGuard)('admin'));
exports.default = router;
//# sourceMappingURL=metrics.routes.js.map