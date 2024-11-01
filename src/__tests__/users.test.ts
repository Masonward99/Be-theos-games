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
    it('returns a 401error if the user is not signed in', async () => {
        let agent = supertest.agent(app)
        await agent.post('/api/users/horrorfan/addresses').expect(401)
    })
    it('returns a 403 error if the users is signed in but isnt the same as the username', async () => {
        let agent = supertest.agent(app)
        //create user
        await agent.post("/api/users/signup").send(user).expect(201);
        //sign in
        await agent.post("/api/users/login").send({ username: "Mw17", password: "1234" }).expect(200);
        //post address
        await agent.post("/api/users/horrorfan/addresses").expect(403)
    })
    it('returns a 201 when given the correct data', async() => {
        let agent = supertest.agent(app);
        //create user
        await agent.post("/api/users/signup").send(user).expect(201);
        //sign in
        await agent
          .post("/api/users/login")
          .send({ username: "Mw17", password: "1234" })
          .expect(200);
        //post address
        await agent.post("/api/users/Mw17/addresses")
            .send({
                postcode: "E1 6AN",
                city: "London",
                address_line1: "22 Fleet Street",
            })
            .expect(201)
    })
    it('returns an address object correctly', async() => {
        let agent = supertest.agent(app);
        //create user
        await agent.post("/api/users/signup").send(user).expect(201);
        //sign in
        await agent
          .post("/api/users/login")
          .send({ username: "Mw17", password: "1234" })
          .expect(200);
        //post address
        let address =  await agent.post("/api/users/Mw17/addresses")
            .send({
                postcode: "E1 6AN",
                city: "London",
                address_line1: "22 Fleet Street",
            })
            .expect(201)
        expect(address.body.address).toEqual({
          postcode: "E1 6AN",
          city: "London",
          address_line1: "22 Fleet Street",
          username: "Mw17",
          address_id:19
        });
    })
})

describe('/api/users/logout', () => {
    const user = {
      password: "1234",
      username: "Mw17",
      dob: "06/06/1999",
      title: "Mr.",
      first_name: "Mason",
      last_name: "Ward",
      email: "masonward99@hotmail.com",
    };
    it('Returns a 200 if it succefully logs out a user', async () => {
        let agent = supertest.agent(app)
        await agent.post('/api/users/signup').send(user).expect(201)
        await agent.post('/api/users/login').send({ username: 'Mw17', password: '1234' }).expect(200)
        await agent.get('/api/users/logout').expect(200)
    })
    it('user is no longer logged in', async () => {
        let agent = supertest.agent(app);
        await agent.post("/api/users/signup").send(user).expect(201);
        await agent
          .post("/api/users/login")
          .send({ username: "Mw17", password: "1234" })
          .expect(200);
        await agent.get("/api/users/logout").expect(200);
        await agent.post("/api/users/Mw17/addresses").send({
          postcode: "E1 6AN",
          city: "London",
          address_line1: "22 Fleet Street",
        }).expect(401)
    })
})