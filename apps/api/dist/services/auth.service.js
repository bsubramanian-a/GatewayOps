"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const auth_repository_1 = require("../repositories/auth.repository");
const authRepo = new auth_repository_1.AuthRepository();
class AuthService {
    async getStats(from, to) {
        return await authRepo.getStats(from, to);
    }
    async getEvents(page, limit) {
        return await authRepo.getEvents(page, limit);
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map