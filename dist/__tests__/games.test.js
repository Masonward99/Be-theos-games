"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
'supertest';
const node_test_1 = require("node:test");
const seed_1 = require("../db/Seed/seed");
const test_data_1 = require("../db/data/test-data/test-data");
const app_1 = __importDefault(require("../app"));
const db_1 = __importDefault(require("../db"));
(0, node_test_1.beforeEach)(() => __awaiter(void 0, void 0, void 0, function* () { return yield (0, seed_1.seed)(test_data_1.testData); }));
afterAll(() => db_1.default.end());
console.log(db_1.default.options.database);
(0, node_test_1.describe)('/api/games', () => {
    it('returns an array of the correct length', () => {
        return (0, supertest_1.default)(app_1.default).get(`/api/games`)
            .expect(200)
            .then(res => expect(res.body.games.length).toBe(16));
    });
    it('returns an array of objects with the correct keys', () => {
        return (0, supertest_1.default)(app_1.default).get(`/api/games`)
            .expect(200)
            .then(res => {
            let gamesArr = res.body.games;
            console.log(gamesArr);
            gamesArr.every((game) => {
                expect(game).toEqual(expect.objectContaining({
                    game_id: expect.any(Number),
                    stock: expect.any(Number),
                    description: expect.any(String),
                    name: expect.any(String),
                    price: expect.any(Number),
                    bgg_id: expect.any(Number)
                }));
            });
        });
    });
});
