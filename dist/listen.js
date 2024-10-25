"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_js_1 = __importDefault(require("./app.js"));
const seed_js_1 = __importDefault(require("./db/Seed/seed.js"));
const { PORT = 9090 } = process.env;
(0, seed_js_1.default)();
app_js_1.default.listen(PORT, () => console.log(`Listening on ${PORT}...`));
