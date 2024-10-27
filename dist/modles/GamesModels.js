"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findGames = findGames;
const db_1 = __importDefault(require("../db"));
function findGames() {
    return db_1.default.query(`SELECT * FROM GAMES`)
        .then(res => res.rows);
}
