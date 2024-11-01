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
const user = {
    password: "1234",
    username: "Mw17",
    dob: "06/06/1999",
    title: "Mr.",
    first_name: "Mason",
    last_name: "Ward",
    email: "masonward99@hotmail.com",
};
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
describe('post/api/users/:username/addresses', () => {
    const user = {
        password: "1234",
        username: "Mw17",
        dob: "06/06/1999",
        title: "Mr.",
        first_name: "Mason",
        last_name: "Ward",
        email: "masonward99@hotmail.com",
    };
    it('returns a 401error if the user is not signed in', () => __awaiter(void 0, void 0, void 0, function* () {
        let agent = supertest_1.default.agent(app_1.default);
        yield agent.post('/api/users/horrorfan/addresses').expect(401);
    }));
    it('returns a 403 error if the users is signed in but isnt the same as the username', () => __awaiter(void 0, void 0, void 0, function* () {
        let agent = supertest_1.default.agent(app_1.default);
        //create user
        yield agent.post("/api/users/signup").send(user).expect(201);
        //sign in
        yield agent.post("/api/users/login").send({ username: "Mw17", password: "1234" }).expect(200);
        //post address
        yield agent.post("/api/users/horrorfan/addresses").expect(403);
    }));
    it('returns a 201 when given the correct data', () => __awaiter(void 0, void 0, void 0, function* () {
        let agent = supertest_1.default.agent(app_1.default);
        //create user
        yield agent.post("/api/users/signup").send(user).expect(201);
        //sign in
        yield agent
            .post("/api/users/login")
            .send({ username: "Mw17", password: "1234" })
            .expect(200);
        //post address
        yield agent.post("/api/users/Mw17/addresses")
            .send({
            postcode: "E1 6AN",
            city: "London",
            address_line1: "22 Fleet Street",
        })
            .expect(201);
    }));
    it('returns an address object correctly', () => __awaiter(void 0, void 0, void 0, function* () {
        let agent = supertest_1.default.agent(app_1.default);
        //create user
        yield agent.post("/api/users/signup").send(user).expect(201);
        //sign in
        yield agent
            .post("/api/users/login")
            .send({ username: "Mw17", password: "1234" })
            .expect(200);
        //post address
        let address = yield agent.post("/api/users/Mw17/addresses")
            .send({
            postcode: "E1 6AN",
            city: "London",
            address_line1: "22 Fleet Street",
        })
            .expect(201);
        expect(address.body.address).toEqual({
            postcode: "E1 6AN",
            city: "London",
            address_line1: "22 Fleet Street",
            username: "Mw17",
            address_id: 19
        });
    }));
});
describe('/api/users/logout', () => {
    it('Returns a 200 if it succefully logs out a user', () => __awaiter(void 0, void 0, void 0, function* () {
        let agent = supertest_1.default.agent(app_1.default);
        yield agent.post('/api/users/signup').send(user).expect(201);
        yield agent.post('/api/users/login').send({ username: 'Mw17', password: '1234' }).expect(200);
        yield agent.get('/api/users/logout').expect(200);
    }));
    it('user is no longer logged in', () => __awaiter(void 0, void 0, void 0, function* () {
        let agent = supertest_1.default.agent(app_1.default);
        yield agent.post("/api/users/signup").send(user).expect(201);
        yield agent
            .post("/api/users/login")
            .send({ username: "Mw17", password: "1234" })
            .expect(200);
        yield agent.get("/api/users/logout").expect(200);
        yield agent.post("/api/users/Mw17/addresses").send({
            postcode: "E1 6AN",
            city: "London",
            address_line1: "22 Fleet Street",
        }).expect(401);
    }));
});
describe("DELETE/api/users/:username/reviews/:review_id", () => {
    it('Returns a 204 when given a valid id ', () => __awaiter(void 0, void 0, void 0, function* () {
        let agent = supertest_1.default.agent(app_1.default);
        yield agent.post('/api/users/login').send({ username: 'coopstrategist', password: '1234' }).expect(200);
        yield agent.delete("/api/users/coopstrategist/addresses/5").expect(204);
    }));
    it("Returns a 401 error if not signed in", () => __awaiter(void 0, void 0, void 0, function* () {
        let agent = supertest_1.default.agent(app_1.default);
        yield agent.delete("/api/users/coopstrategist/addresses/5").expect(401);
    }));
    it("returns a 403 if signed in to a different user", () => __awaiter(void 0, void 0, void 0, function* () {
        let agent = supertest_1.default.agent(app_1.default);
        yield agent.post('/api/users/login').send({ username: 'familygamer', password: '1234' }).expect(200);
        yield agent.delete("/api/users/coopstrategist/addresses/5").expect(403);
    }));
    it("deletes the review with that id", () => __awaiter(void 0, void 0, void 0, function* () {
        let agent = supertest_1.default.agent(app_1.default);
        yield agent
            .post("/api/users/login")
            .send({ username: "coopstrategist", password: "1234" })
            .expect(200);
        yield agent.delete("/api/users/coopstrategist/addresses/5").expect(204);
        let res = yield db_1.default.query('SELECT * FROM addresses WHERE address_id = 5');
        expect(res.rows.length).toBe(0);
    }));
    it('returns a 404 error if review does not exist on that user', () => __awaiter(void 0, void 0, void 0, function* () {
        let agent = supertest_1.default.agent(app_1.default);
        yield agent
            .post("/api/users/login")
            .send({ username: "coopstrategist", password: "1234" })
            .expect(200);
        yield agent
            .delete("/api/users/coopstrategist/addresses/1")
            .expect(404);
    }));
});
describe('GET/api/users/:username/reviews', () => {
    it('Returns a 200 when given a valid username', () => __awaiter(void 0, void 0, void 0, function* () {
        let agent = supertest_1.default.agent(app_1.default);
        yield agent
            .post("/api/users/login")
            .send({ username: "coopstrategist", password: "1234" })
            .expect(200);
        yield agent.get('/api/users/coopstrategist/addresses').expect(200);
    }));
    it('returns an array of the correct length', () => __awaiter(void 0, void 0, void 0, function* () {
        let agent = supertest_1.default.agent(app_1.default);
        yield agent
            .post("/api/users/login")
            .send({ username: "coopstrategist", password: "1234" })
            .expect(200);
        let res = yield agent.get("/api/users/coopstrategist/addresses").expect(200);
        expect(res.body.addresses.length).toBe(2);
    }));
    it('each address has the correct keys', () => __awaiter(void 0, void 0, void 0, function* () {
        let agent = supertest_1.default.agent(app_1.default);
        yield agent
            .post("/api/users/login")
            .send({ username: "coopstrategist", password: "1234" })
            .expect(200);
        let res = yield agent
            .get("/api/users/coopstrategist/addresses")
            .expect(200);
        res.body.addresses.every((address) => expect(address).toEqual(expect.objectContaining({
            address_line1: expect.any(String),
            postcode: expect.any(String),
            city: expect.any(String),
            username: expect.any(String),
            address_id: expect.any(Number)
        })));
    }));
    it('returns a 401 when not signed in', () => __awaiter(void 0, void 0, void 0, function* () {
        let agent = supertest_1.default.agent(app_1.default);
        yield agent.get('/api/users/coopstrategist/addresses').expect(401);
    }));
    it('returns a 403 if logged in to a different user', () => __awaiter(void 0, void 0, void 0, function* () {
        let agent = supertest_1.default.agent(app_1.default);
        yield agent
            .post("/api/users/login")
            .send({ username: "familygamer", password: "1234" })
            .expect(200);
        yield agent.get("/api/users/coopstrategist/addresses").expect(403);
    }));
});
describe.only('POST/api/users/:username/orders', () => {
    it('returns a 201 when given correct data', () => __awaiter(void 0, void 0, void 0, function* () {
        let agent = supertest_1.default.agent(app_1.default);
        yield agent.post('/api/users/login').send({ username: 'familygamer', password: '1234' }).expect(200);
        agent.post('/api/users/familygamer/orders').send({
            date: '06/06/2024',
            address_id: 3,
            games: [{ id: 1, qty: 3 }, { id: 2, qty: 1 }]
        }).expect(201);
    }));
});
