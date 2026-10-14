"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const services_controller_1 = require("../controllers/services.controller");
const router = (0, express_1.Router)();
const controller = new services_controller_1.ServicesController();
router.get('/', (req, res, next) => controller.findAll(req, res, next));
router.get('/:slug/stats', (req, res, next) => controller.getStats(req, res, next));
exports.default = router;
//# sourceMappingURL=services.routes.js.map