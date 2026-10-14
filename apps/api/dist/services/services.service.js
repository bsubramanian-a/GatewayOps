"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServicesService = void 0;
const services_repository_1 = require("../repositories/services.repository");
const servicesRepo = new services_repository_1.ServicesRepository();
class ServicesService {
    async getServices() {
        return await servicesRepo.findAll();
    }
    async getServiceStats(slug) {
        const service = await servicesRepo.findBySlug(slug);
        if (!service) {
            throw new Error('Service not found');
        }
        return await servicesRepo.getStats(service.id);
    }
}
exports.ServicesService = ServicesService;
//# sourceMappingURL=services.service.js.map