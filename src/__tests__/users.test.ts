import supertest from "supertest";
import { seed } from "../db/Seed/seed";
import { testData } from "../db/data/test-data/test-data";
import app from "../app";
import db from "../db";


beforeEach(async () =>await seed(testData));
afterAll(() => db.end());

describe('POST/api/users/signup', () => {
    const user = {
        username: 'Mw17',
        password: '1234',
        dob: '06/06/1999',
        title: 'Mr.',
        first_name: 'Mason',
        last_name: 'Ward',
        email:'masonward99@hotmail.com'
    }
    it('Returns a 201 if given the correct data ', () => {
        return supertest(app).post('/api/users/signup').send(user)
    })
    it('Returns a 409 error if username already exists', () => {
        return supertest(app).post("/api/users/signup").send({
          username: "boardgamefan",
          password: "1234",
          dob: "06/06/1999",
          title: "Mr.",
          first_name: "Mason",
          last_name: "Ward",
          email: "masonward99@hotmail.com",
        }).expect(409)
    })
    it('returns a 400 error if no password in object', () => {
        return supertest(app).post("/api/users/signup").send({
          username: "Mw17",
          dob: "06/06/1999",
          title: "Mr.",
          first_name: "Mason",
          last_name: "Ward",
          email: "masonward99@hotmail.com",
        }).expect(400)
    })
    it('returns the created user', async () => {
        const userData = await supertest(app).post("/api/users/signup").send(user)
            .expect(201)
        expect(userData.body.user).toEqual({
          username: "Mw17",
          dob: "1999-06-05T23:00:00.000Z",
          title: "Mr.",
          first_name: "Mason",
          last_name: "Ward",
          email: "masonward99@hotmail.com",
        });
    })
})

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
    it('returns a 200 when is succesfully authenticated', async () => {
        let agent = supertest.agent(app)
        await agent.post('/api/users/signup').send(user).expect(201)
        const response = await agent.post('/api/users/login').send({ username: 'Mw17', password: '1234' }).expect(200)     
    })
    it('returns a 401 error when password is wrong', async () => {
        let agent = supertest.agent(app);
        await agent.post('/api/users/signup').send(user).expect(201)
         await agent.post('/api/users/login').send({username:'Mw17', password:'123'}).expect(401)
    })
    it('returns a 401 if username is wrong', async () => {
        let agent = supertest.agent(app);
        await agent.post("/api/users/signup").send(user).expect(201);
        await agent.post("/api/users/login")
          .send({ username: "Mw15", password: "1234" })
          .expect(401); 
    })
    it('returns the signed in user object', async () => {
        let agent = supertest.agent(app);
        await agent.post("/api/users/signup").send(user).expect(201);
        const response = await agent
          .post("/api/users/login")
          .send({ username: "Mw17", password: "1234" })
            .expect(200)
        const userData = response.body.userData
        expect(userData).toEqual({
          username: "Mw17",
          dob: "1999-06-05T23:00:00.000Z",
          title: "Mr.",
          first_name: "Mason",
          last_name: "Ward",
          email: "masonward99@hotmail.com",
        });
    })
})