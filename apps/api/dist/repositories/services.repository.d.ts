import { Service } from '../types';
export declare class ServicesRepository {
    findAll(): Promise<Service[]>;
    findBySlug(slug: string): Promise<Service | null>;
    getStats(serviceId: string): Promise<any>;
}
//# sourceMappingURL=services.repository.d.ts.map