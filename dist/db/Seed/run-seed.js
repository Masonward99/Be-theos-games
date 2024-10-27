"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const seed_1 = require("./seed");
const db_1 = __importDefault(require("../../db"));
const test_data_1 = require("../data/test-data/test-data");
function runSeed() {
    return (0, seed_1.seed)(test_data_1.testData)
        .then(() => db_1.default.end());
}
runSeed();
