"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
const ENV = process.env.NODE_ENV || 'development';
dotenv_1.default.config({
    path: `${__dirname}/../.env.${ENV}`,
});
if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
    throw new Error('PGDATABASE not set or DATABASE_URL not set');
}
const config = ENV === "production"
    ? {
        connectionString: process.env.DATABASE_URL,
        max: 2,
    }
    : {
        database: process.env.DATABASE_URL
    };
const db = new pg_1.Pool(config);
exports.default = db;
