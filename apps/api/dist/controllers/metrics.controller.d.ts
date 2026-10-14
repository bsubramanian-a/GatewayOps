import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
export declare class MetricsController {
    getSummary(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    getRequestsOverTime(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    getErrorTrends(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    getServiceDistribution(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    getDetailedMetrics(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=metrics.controller.d.ts.map