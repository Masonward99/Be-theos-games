"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const seed_1 = require("./seed");
const dev_data_1 = require("../data/developement-data/dev-data");
const db_1 = __importDefault(require("../../db"));
function runSeed() {
    return (0, seed_1.seed)(dev_data_1.devData)
        .then(() => db_1.default.end());
}
runSeed();
