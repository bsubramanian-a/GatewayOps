"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("redis");
const env_1 = require("./env");
const redis = (0, redis_1.createClient)({
    url: env_1.env.REDIS_URL,
});
redis.on('error', (err) => {
    console.error('Redis error:', err);
});
exports.default = redis;
//# sourceMappingURL=redis.js.map