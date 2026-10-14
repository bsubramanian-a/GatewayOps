"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("../services/auth.service");
const authService = new auth_service_1.AuthService();
class AuthController {
    async getStats(req, res, next) {
        try {
            const { from, to } = req.query;
            const stats = await authService.getStats(from, to);
            res.json({ data: stats });
        }
        catch (error) {
            next(error);
        }
    }
    async getEvents(req, res, next) {
        try {
            const { page = '1', limit = '10' } = req.query;
            const result = await authService.getEvents(parseInt(page, 10), parseInt(limit, 10));
            res.json(result);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map