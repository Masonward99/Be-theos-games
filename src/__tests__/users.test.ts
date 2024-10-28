import supertest from "supertest";
import { seed } from "../db/Seed/seed";
import { testData } from "../db/data/test-data/test-data";
import app from "../app";
import db from "../db";


beforeEach(async () =>await seed(testData));
afterAll(() => db.end());

describe('POST/api/users', () => {
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
        return supertest(app).post('/api/users/').send(user)
    })
})