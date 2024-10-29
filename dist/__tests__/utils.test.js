"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../db"));
const utils_1 = require("../utils");
afterAll(() => db_1.default.end());
describe(`check exists`, () => {
    it('returns a rejected promise if the item doesnt exist in the db', () => {
        return expect((0, utils_1.checkExists)('games', 'game_id', [19])).rejects.toEqual({ status: 404, msg: 'Resource not found' });
    });
    it('resolves to an undefined promise if value does exist', () => {
        return expect((0, utils_1.checkExists)('games', 'game_id', [1])).resolves.toBe(undefined);
    });
});
