"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_js_1 = __importDefault(require("../../db.js"));
const dropTables = () => {
    return db_js_1.default.query(`DROP TABLE IF EXISTS order_items`)
        .then(() => db_js_1.default.query(`DROP TABLE IF EXISTS orders`))
        .then(() => db_js_1.default.query(`DROP TABLE IF EXISTS addresses`))
        .then(() => db_js_1.default.query(`DROP TABLE IF EXISTS reviews`))
        .then(() => db_js_1.default.query(`DROP TABLE IF EXISTS images`))
        .then(() => db_js_1.default.query(`DROP TABLE IF EXISTS games_categories`))
        .then(() => db_js_1.default.query(`DROP TABLE IF EXISTS cards`))
        .then(() => db_js_1.default.query(`DROP TABLE IF EXISTS sleeves`))
        .then(() => db_js_1.default.query(`DROP TABLE IF EXISTS categories`))
        .then(() => db_js_1.default.query(`DROP TABLE IF EXISTS users`))
        .then(() => db_js_1.default.query(`DROP TABLE IF EXISTS games`));
    // return db.query(`SELECT * FROM categories`)
    // .then(res => console.log(res))
};
exports.default = dropTables;
