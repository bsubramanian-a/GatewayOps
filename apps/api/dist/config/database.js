"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const knex_1 = __importDefault(require("knex"));
const env_1 = require("./env");
const knexInstance = (0, knex_1.default)({
    client: 'pg',
    connection: env_1.env.DATABASE_URL,
    migrations: {
        directory: './dist/migrations',
        extension: 'js',
    },
    seeds: {
        directory: './dist/seeds',
        extension: 'js',
    },
});
exports.db = knexInstance;
//# sourceMappingURL=database.js.map