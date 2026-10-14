"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServicesController = void 0;
const services_service_1 = require("../services/services.service");
const servicesService = new services_service_1.ServicesService();
class ServicesController {
    async findAll(req, res, next) {
        try {
            const services = await servicesService.getServices();
            res.json({ data: services });
        }
        catch (error) {
            next(error);
        }
    }
    async getStats(req, res, next) {
        try {
            const { slug } = req.params;
            const stats = await servicesService.getServiceStats(slug);
            res.json({ data: stats });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.ServicesController = ServicesController;
//# sourceMappingURL=services.controller.js.map