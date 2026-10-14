"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const zod_1 = require("zod");
const envSchema = zod_1.z.object({
    DATABASE_URL: zod_1.z.string().url(),
    REDIS_URL: zod_1.z.string().url(),
    PORT: zod_1.z.string().transform(Number).default('4000'),
    NODE_ENV: zod_1.z.enum(['development', 'production']).default('development'),
    JWT_SECRET: zod_1.z.string(),
    RUN_MIGRATIONS: zod_1.z.string().transform(v => v === 'true').default('false'),
    RUN_SEEDS: zod_1.z.string().transform(v => v === 'true').default('false'),
});
exports.env = envSchema.parse(process.env);
//# sourceMappingURL=env.js.map