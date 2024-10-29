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
describe('POST/api/users/signup', () => {
    const user = {
        username: 'Mw17',
        password: '1234',
        dob: '06/06/1999',
        title: 'Mr.',
        first_name: 'Mason',
        last_name: 'Ward',
        email: 'masonward99@hotmail.com'
    };
    it('Returns a 201 if given the correct data ', () => {
        return (0, supertest_1.default)(app_1.default).post('/api/users/signup').send(user);
    });
    it('Returns a 409 error if username already exists', () => {
        return (0, supertest_1.default)(app_1.default).post("/api/users/signup").send({
            username: "boardgamefan",
            password: "1234",
            dob: "06/06/1999",
            title: "Mr.",
            first_name: "Mason",
            last_name: "Ward",
            email: "masonward99@hotmail.com",
        }).expect(409);
    });
    it('returns a 400 error if no password in object', () => {
        return (0, supertest_1.default)(app_1.default).post("/api/users/signup").send({
            username: "Mw17",
            dob: "06/06/1999",
            title: "Mr.",
            first_name: "Mason",
            last_name: "Ward",
            email: "masonward99@hotmail.com",
        }).expect(400);
    });
    it('returns the created user', () => __awaiter(void 0, void 0, void 0, function* () {
        const userData = yield (0, supertest_1.default)(app_1.default).post("/api/users/signup").send(user)
            .expect(201);
        expect(userData.body.user).toEqual({
            username: "Mw17",
            dob: "1999-06-05T23:00:00.000Z",
            title: "Mr.",
            first_name: "Mason",
            last_name: "Ward",
            email: "masonward99@hotmail.com",
        });
    }));
});
describe(`POST/api/users/login`, () => {
    const user = {
        password: "1234",
        username: "Mw17",
        dob: "06/06/1999",
        title: "Mr.",
        first_name: "Mason",
        last_name: "Ward",
        email: "masonward99@hotmail.com",
    };
    it('returns a 200 when is succesfully authenticated', () => __awaiter(void 0, void 0, void 0, function* () {
        let agent = supertest_1.default.agent(app_1.default);
        yield agent.post('/api/users/signup').send(user).expect(201);
        const response = yield agent.post('/api/users/login').send({ username: 'Mw17', password: '1234' }).expect(200);
    }));
    it('returns a 401 error when password is wrong', () => __awaiter(void 0, void 0, void 0, function* () {
        let agent = supertest_1.default.agent(app_1.default);
        yield agent.post('/api/users/signup').send(user).expect(201);
        yield agent.post('/api/users/login').send({ username: 'Mw17', password: '123' }).expect(401);
    }));
    it('returns a 401 if username is wrong', () => __awaiter(void 0, void 0, void 0, function* () {
        let agent = supertest_1.default.agent(app_1.default);
        yield agent.post("/api/users/signup").send(user).expect(201);
        yield agent.post("/api/users/login")
            .send({ username: "Mw15", password: "1234" })
            .expect(401);
    }));
    it('returns the signed in user object', () => __awaiter(void 0, void 0, void 0, function* () {
        let agent = supertest_1.default.agent(app_1.default);
        yield agent.post("/api/users/signup").send(user).expect(201);
        const response = yield agent
            .post("/api/users/login")
            .send({ username: "Mw17", password: "1234" })
            .expect(200);
        const userData = response.body.userData;
        expect(userData).toEqual({
            username: "Mw17",
            dob: "1999-06-05T23:00:00.000Z",
            title: "Mr.",
            first_name: "Mason",
            last_name: "Ward",
            email: "masonward99@hotmail.com",
        });
    }));
});
