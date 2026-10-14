"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.AppError = void 0;
const zod_1 = require("zod");
class AppError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
    }
}
exports.AppError = AppError;
const errorHandler = (err, req, res, next) => {
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            error: err.message,
            status: err.statusCode,
        });
    }
    if (err instanceof zod_1.ZodError) {
        return res.status(400).json({
            error: 'Validation error',
            details: err.errors,
        });
    }
    console.error('Unhandled error:', err);
    res.status(500).json({
        error: 'Internal server error',
        status: 500,
    });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=errorHandler.js.map