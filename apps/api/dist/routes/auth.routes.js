"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const router = (0, express_1.Router)();
const controller = new auth_controller_1.AuthController();
router.get('/stats', (req, res, next) => controller.getStats(req, res, next));
router.get('/events', (req, res, next) => controller.getEvents(req, res, next));
exports.default = router;
//# sourceMappingURL=auth.routes.js.map