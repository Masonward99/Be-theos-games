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
describe('GET/api/games', () => {
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
            gamesArr.every((game) => {
                expect(game).toEqual(expect.objectContaining({
                    game_id: expect.any(Number),
                    stock: expect.any(Number),
                    game_body: expect.any(String),
                    name: expect.any(String),
                    price: expect.any(Number),
                    bgg_id: expect.any(Number),
                    average_review: expect.any(Number),
                    num_reviews: expect.any(Number)
                }));
            });
        });
    });
});
describe(`GET/api/games/:game_id`, () => {
    it('returns the correct object when given a valid id', () => {
        return (0, supertest_1.default)(app_1.default).get(`/api/games/10`)
            .expect(200)
            .then(res => {
            let game = res.body.game;
            expect(game).toEqual({
                game_id: 10,
                stock: 9,
                game_body: "A game of civilization-building through three ages, where players collect resources, build structures, and develop their city to win.",
                name: "7 Wonders",
                price: 2599,
                bgg_id: 123789,
                num_reviews: 0,
                average_review: 0
            });
        });
    });
    it('returns a 404 if game does not exist', () => {
        return (0, supertest_1.default)(app_1.default).get(`/api/games/20`)
            .expect(404);
    });
    it('returns a 400 error if game_id is not a number', () => {
        return (0, supertest_1.default)(app_1.default).get(`/api/games/cat`)
            .expect(400);
    });
});
describe('GET/api/games/:game_id/reviews', () => {
    it('returns an array of reviews', () => {
        return (0, supertest_1.default)(app_1.default).get('/api/games/4/reviews')
            .expect(200)
            .then((res) => {
            let reviews = res.body.reviews;
            reviews.every((review) => {
                expect(review).toEqual(expect.objectContaining({
                    entity_type: expect.any(String),
                    entity_id: expect.any(Number),
                    rating: expect.any(Number),
                    review_id: expect.any(Number),
                    author: expect.any(String),
                    review_body: expect.any(String),
                    review_title: expect.any(String),
                    created_at: expect.any(String)
                }));
            });
        });
    });
    it('returns a 404 if game does not exist', () => {
        return (0, supertest_1.default)(app_1.default).get(`/api/games/20/reviews`)
            .expect(404);
    });
    it('returns a 400 if the game id is of the wrong type', () => {
        return (0, supertest_1.default)(app_1.default).get(`/api/games/cat/reviews`)
            .expect(400);
    });
    it('returns an empty array if there are no reviews on that game', () => {
        return (0, supertest_1.default)(app_1.default).get('/api/games/10/reviews')
            .expect(200)
            .then(res => expect(res.body.reviews.length).toBe(0));
    });
    it('returns an array of the correct length', () => {
        return (0, supertest_1.default)(app_1.default).get('/api/games/4/reviews')
            .expect(200)
            .then(res => expect(res.body.reviews.length).toBe(2));
    });
});
