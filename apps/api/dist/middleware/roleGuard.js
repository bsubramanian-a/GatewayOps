"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleGuard = void 0;
const errorHandler_1 = require("./errorHandler");
const roleGuard = (requiredRole) => {
    return (req, res, next) => {
        if (!req.user || req.user.role !== requiredRole) {
            return next(new errorHandler_1.AppError(403, 'Insufficient permissions'));
        }
        next();
    };
};
exports.roleGuard = roleGuard;
//# sourceMappingURL=roleGuard.js.map