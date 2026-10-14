"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("./config/database");
const env_1 = require("./config/env");
const redis_1 = __importDefault(require("./config/redis"));
const app_1 = require("./app");
async function main() {
    try {
        await redis_1.default.connect();
        console.log('Redis connected');
        if (env_1.env.RUN_MIGRATIONS) {
            console.log('Running migrations...');
            await database_1.db.migrate.latest();
            console.log('Migrations completed');
        }
        if (env_1.env.RUN_SEEDS) {
            console.log('Running seeds...');
            await database_1.db.seed.run();
            console.log('Seeds completed');
        }
        const app = (0, app_1.createApp)();
        const port = env_1.env.PORT;
        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    }
    catch (error) {
        console.error('Fatal error:', error);
        process.exit(1);
    }
}
main();
//# sourceMappingURL=index.js.map