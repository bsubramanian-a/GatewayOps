import { RateLimitViolation } from '../types';
export declare class RateLimitsRepository {
    getSummary(from?: string, to?: string): Promise<any>;
    getViolations(from?: string, to?: string): Promise<RateLimitViolation[]>;
    getTopOffenders(): Promise<any[]>;
}
//# sourceMappingURL=rateLimits.repository.d.ts.map