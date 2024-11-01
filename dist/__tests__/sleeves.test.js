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
describe('GET/api/sleeves', () => {
    it('returns a 200', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app_1.default).get('/api/sleeves').expect(200);
    }));
    it('returns an array of correct length', () => __awaiter(void 0, void 0, void 0, function* () {
        let res = yield (0, supertest_1.default)(app_1.default).get('/api/sleeves').expect(200);
        expect(res.body.sleeves.length).toBe(10);
    }));
    it('Each sleeve has the correct keys', () => __awaiter(void 0, void 0, void 0, function* () {
        let res = yield (0, supertest_1.default)(app_1.default).get('/api/sleeves').expect(200);
        const { sleeves } = res.body;
        sleeves.every((sleeve) => expect(sleeve).toEqual(expect.objectContaining({
            sleeve_id: expect.any(Number),
            sleeve_name: expect.any(String),
            price: expect.any(Number),
            stock: expect.any(Number),
            height: expect.any(Number),
            width: expect.any(Number),
            pack_size: expect.any(Number),
            description: expect.any(String),
            average_review: expect.any(String),
            num_reviews: expect.any(String)
        })));
    }));
});
describe("POST/api/sleeves", () => {
    const sleeve = {
        sleeve_name: "Ultra Pro Standard Sleeves",
        price: 1000,
        stock: 200,
        height: 88,
        width: 63,
        pack_size: 50,
        description: "Standard sleeves for card protection.",
    };
    it('Returns a 201 when the correct body is added', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app_1.default).post('/api/sleeves').send(sleeve).expect(201);
    }));
    it('Returns the created sleeve object', () => __awaiter(void 0, void 0, void 0, function* () {
        let res = yield (0, supertest_1.default)(app_1.default).post('/api/sleeves').send(sleeve).expect(201);
        expect(res.body.sleeve).toEqual(Object.assign({ sleeve_id: 11 }, sleeve));
    }));
    it('Returns a 400 if a numerical value is a string', () => __awaiter(void 0, void 0, void 0, function* () {
        sleeve.width = 'cat';
        yield (0, supertest_1.default)(app_1.default).post('/api/sleeves').send(sleeve).expect(400);
    }));
    it('Returns a 400 error if a value is missing', () => __awaiter(void 0, void 0, void 0, function* () {
        delete sleeve['width'];
        yield (0, supertest_1.default)(app_1.default).post('/api/sleeves').send(sleeve).expect(400);
    }));
});
describe("GET/api/sleeves/:sleeve_id", () => {
    it('Returns a 201 when given a valid id', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app_1.default).get('/api/sleeves/10').expect(200);
    }));
    it('Returns a sleeve object including the average reviews', () => __awaiter(void 0, void 0, void 0, function* () {
        let res = yield (0, supertest_1.default)(app_1.default).get('/api/sleeves/10').expect(200);
        expect(res.body.sleeve).toEqual({
            sleeve_name: "Eco-Friendly Sleeves",
            price: 499,
            stock: 70,
            height: 88,
            width: 63,
            pack_size: 100,
            description: "Biodegradable sleeves made from eco-friendly materials, offering protection while reducing environmental impact.",
            num_reviews: '0',
            average_review: null,
            sleeve_id: 10
        });
    }));
    it('returns a 404 if id is valid but doesnt exist', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app_1.default).get('/api/sleeves/11').expect(404);
    }));
    it('returns a 400 error if id is not a number', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app_1.default).get('/api/sleeves/cat').expect(400);
    }));
});
describe('DELETE /api/sleeves/:sleeve_id', () => {
    it('Returns a 204 when given a valid id', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app_1.default).delete('/api/sleeves/1').expect(204);
    }));
    it('Deletes the sleeve at that id', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app_1.default).delete('/api/sleeves/1').expect(204);
        yield (0, supertest_1.default)(app_1.default).get('/api/sleeves/1').expect(404);
    }));
    it("Deletes all reviews on that sleeve", () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app_1.default).delete('/api/sleeves/1').expect(204);
        let res = yield db_1.default.query(`SELECT * FROM reviews WHERE (entity_type = 'sleeves' AND entity_id = 1)`);
        expect(res.rows.length).toBe(0);
    }));
    it("returns 404 if id doesnt exist", () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app_1.default).delete('/api/sleeves/40').expect(404);
    }));
    it('returns a 400 for a invalid id', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app_1.default).delete('/api/sleeves/cat').expect(400);
    }));
});
describe('GET/api/sleeves/:sleeve_id/reviews', () => {
    it('Returns a 200 when give a valid id', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app_1.default).get('/api/sleeves/2/reviews').expect(200);
    }));
    it('Returns an array of the correct length', () => __awaiter(void 0, void 0, void 0, function* () {
        let res = yield (0, supertest_1.default)(app_1.default).get('/api/sleeves/1/reviews').expect(200);
        expect(res.body.reviews.length).toBe(2);
    }));
    it('Returns an empty array if there are no reviews', () => __awaiter(void 0, void 0, void 0, function* () {
        let res = yield (0, supertest_1.default)(app_1.default).get('/api/sleeves/10/reviews').expect(200);
        expect(res.body.reviews).toEqual([]);
    }));
    it('Returns an array with correct keys', () => __awaiter(void 0, void 0, void 0, function* () {
        let res = yield (0, supertest_1.default)(app_1.default).get('/api/sleeves/1/reviews').expect(200);
        res.body.reviews.every((review) => expect(review).toEqual(expect.objectContaining({
            entity_type: expect.any(String),
            entity_id: expect.any(Number),
            rating: expect.any(Number),
            review_id: expect.any(Number),
            author: expect.any(String),
            review_body: expect.any(String),
            review_title: expect.any(String),
            created_at: expect.any(String),
        })));
    }));
    it('Returns a 404 if sleeve_id doesnt exist', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app_1.default).get('/api/sleeves/20/reviews').expect(404);
    }));
    it('Returns a 400 error if sleeve id is invalid', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app_1.default).get('/api/sleeves/cat/reviews').expect(400);
    }));
});
describe("POST/api/sleeves/:sleeve_id/reviews", () => {
    const review = {
        rating: 4,
        review_title: 'a review',
        review_body: 'This is a good review',
        created_at: '2024/06/06',
        author: 'econwizard'
    };
    it("Returns a 201 when give the correct data", () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app_1.default).post('/api/sleeves/1/reviews').send(review).expect(201);
    }));
    it("Returns the created review", () => __awaiter(void 0, void 0, void 0, function* () {
        let res = yield (0, supertest_1.default)(app_1.default).post('/api/sleeves/1/reviews').send(review).expect(201);
        expect(res.body.review).toEqual({
            rating: 4,
            review_title: "a review",
            review_body: "This is a good review",
            created_at: "2024-06-05T23:00:00.000Z",
            author: "econwizard",
            entity_id: 1,
            entity_type: 'sleeves',
            review_id: 23
        });
    }));
    it('returns a 404 error if review does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app_1.default).post('/api/sleeves/20/reviews').send(review).expect(404);
    }));
    it('returns a 400 error if given a invalid id', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app_1.default).post('/api/sleeves/cat/reviews').send(review).expect(400);
    }));
    it('returns a 400 error if author does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
        review.author = 'mason';
        yield (0, supertest_1.default)(app_1.default).post('/api/sleeves/1/reviews').send(review).expect(400);
    }));
});
