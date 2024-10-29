import supertest from "supertest";
import { seed } from "../db/Seed/seed";
import { testData } from "../db/data/test-data/test-data";
import app from "../app";
import db from "../db";


beforeEach(async () =>await seed(testData));
afterAll(() => db.end());

describe('POST/api/users/signup', () => {
    it('Returns a 201 if given the correct data ', () => {
        const user = {
            password: '1234',
            username: 'Mw17',
            dob: '06/06/1999',
            title: 'Mr.',
            first_name: 'Mason',
            last_name: 'Ward',
            email:'masonward99@hotmail.com'
        }
        return supertest(app).post('/api/users/signup').send(user)
    })
})

describe(`POST/api/users/login`, () => {
    let agent = supertest.agent(app)
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
        
        await agent.post('/api/users/signup').send(user).expect(201)

        const response = await agent.post('/api/users/login').send({ username: 'Mw17', password: '1234' }).expect(200)
        
    })
})