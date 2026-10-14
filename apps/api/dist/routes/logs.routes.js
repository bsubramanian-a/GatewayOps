"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const logs_controller_1 = require("../controllers/logs.controller");
const router = (0, express_1.Router)();
const controller = new logs_controller_1.LogsController();
router.get('/', (req, res, next) => controller.findAll(req, res, next));
router.get('/:id', (req, res, next) => controller.findOne(req, res, next));
exports.default = router;
//# sourceMappingURL=logs.routes.js.map