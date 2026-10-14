import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
export declare class AuthController {
    getStats(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    getEvents(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=auth.controller.d.ts.map