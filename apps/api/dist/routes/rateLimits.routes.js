"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const rateLimits_controller_1 = require("../controllers/rateLimits.controller");
const router = (0, express_1.Router)();
const controller = new rateLimits_controller_1.RateLimitsController();
router.get('/summary', (req, res, next) => controller.getSummary(req, res, next));
router.get('/violations', (req, res, next) => controller.getViolations(req, res, next));
router.get('/top-offenders', (req, res, next) => controller.getTopOffenders(req, res, next));
exports.default = router;
//# sourceMappingURL=rateLimits.routes.js.map