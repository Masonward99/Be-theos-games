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
const seed_1 = require("../db/Seed/seed");
const test_data_1 = require("../db/data/test-data/test-data");
const app_1 = __importDefault(require("../app"));
const db_1 = __importDefault(require("../db"));
beforeEach(() => __awaiter(void 0, void 0, void 0, function* () { return yield (0, seed_1.seed)(test_data_1.testData); }));
afterAll(() => db_1.default.end());
describe('GET/api/categories', () => {
    it('returns an array of correct length', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default).get('/api/categories').expect(200);
        expect(response.body.categories.length).toBe(10);
    }));
    it('Each element of categories has the correct keys', () => __awaiter(void 0, void 0, void 0, function* () {
        const categories = (yield (0, supertest_1.default)(app_1.default).get('/api/categories').expect(200)).body.categories;
        categories.every((category) => expect(category).toEqual(expect.objectContaining({
            category_name: expect.any(String),
            description: expect.any(String),
            num_games: expect.any(String)
        })));
    }));
});
describe('Post/api/categories', () => {
    it('Returns a 201 and the newly created category if given correct data', () => __awaiter(void 0, void 0, void 0, function* () {
        const category = yield (0, supertest_1.default)(app_1.default).post('/api/categories').send({ category_name: 'test-category', description: 'this is a new category' }).expect(201);
        expect(category.body.category).toEqual({ category_name: 'test-category', description: 'this is a new category' });
    }));
    it('Returns a 409 if the category name already exists', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app_1.default).post('/api/categories').send({ category_name: 'strategy', description: 'A game of strategy' }).expect(409);
    }));
    it('Returns a 400 error if category name is not included', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app_1.default).post('/api/categories').send({ description: 'my new category' }).expect(400);
    }));
    it('Returns a 400 error if category name is not a string', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app_1.default).post('/api/categories').send({ category_name: 12, description: 'a nice description' });
    }));
});
