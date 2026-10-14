import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
export declare class RateLimitsController {
    getSummary(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    getViolations(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    getTopOffenders(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=rateLimits.controller.d.ts.map