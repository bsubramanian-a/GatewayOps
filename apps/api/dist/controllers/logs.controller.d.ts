import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
export declare class LogsController {
    findAll(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    findOne(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=logs.controller.d.ts.map