import supertest from "supertest";
import { seed } from "../db/Seed/seed";
import { testData } from "../db/data/test-data/test-data";
import app from "../app";
import db from "../db";
import exp from "constants";
import { sleeves } from "../db/data/test-data/sleeves";
import { exec } from "child_process";


beforeEach(async () =>await seed(testData));
afterAll(() => db.end());

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

describe("DELETE/api/users/:username/reviews/:review_id", () => {
    it('Returns a 204 when given a valid id ', async () => {
        let agent = supertest.agent(app)
        await agent.post('/api/users/login').send({ username: 'coopstrategist', password: '1234' }).expect(200)
        await agent.delete("/api/users/coopstrategist/addresses/5").expect(204);
    })
    it("Returns a 401 error if not signed in", async () => {
        let agent = supertest.agent(app)
        await agent.delete("/api/users/coopstrategist/addresses/5").expect(401);
    })
    it("returns a 403 if signed in to a different user", async () => {
        let agent = supertest.agent(app)
        await agent.post('/api/users/login').send({ username: 'familygamer', password: '1234' }).expect(200)
        await agent.delete("/api/users/coopstrategist/addresses/5").expect(403);
    })
    it("deletes the review with that id", async () => {
        let agent = supertest.agent(app)
        await agent
          .post("/api/users/login")
          .send({ username: "coopstrategist", password: "1234" })
          .expect(200);
        await agent.delete("/api/users/coopstrategist/addresses/5").expect(204)
        let res = await db.query('SELECT * FROM addresses WHERE address_id = 5')
        expect(res.rows.length).toBe(0)
    })
    it('returns a 404 error if review does not exist on that user', async () => {
         let agent = supertest.agent(app);
         await agent
           .post("/api/users/login")
           .send({ username: "coopstrategist", password: "1234" })
           .expect(200);
         await agent
           .delete("/api/users/coopstrategist/addresses/1")
           .expect(404);
    })
})

describe('GET/api/users/:username/reviews', () => {
    it('Returns a 200 when given a valid username', async () => {
        let agent = supertest.agent(app)
        await agent
          .post("/api/users/login")
          .send({ username: "coopstrategist", password: "1234" })
            .expect(200);
        await agent.get('/api/users/coopstrategist/addresses').expect(200)
    })
    it('returns an array of the correct length', async () => {
         let agent = supertest.agent(app);
         await agent
           .post("/api/users/login")
           .send({ username: "coopstrategist", password: "1234" })
           .expect(200);
        let res = await agent.get("/api/users/coopstrategist/addresses").expect(200);
        expect(res.body.addresses.length).toBe(2)
    })
    it('each address has the correct keys', async () => {
        let agent = supertest.agent(app);
        await agent
          .post("/api/users/login")
          .send({ username: "coopstrategist", password: "1234" })
          .expect(200);
        let res = await agent
          .get("/api/users/coopstrategist/addresses")
            .expect(200)
        res.body.addresses.every((address: any) => expect(address).toEqual(expect.objectContaining({
            address_line1: expect.any(String),
            postcode: expect.any(String),
            city: expect.any(String),
            username: expect.any(String),
            address_id:expect.any(Number)
        })))
    })
    it('returns a 401 when not signed in', async () => {
        let agent = supertest.agent(app)
        await agent.get('/api/users/coopstrategist/addresses').expect(401)
    })
    it('returns a 403 if logged in to a different user', async () => {
        let agent = supertest.agent(app);
        await agent
          .post("/api/users/login")
          .send({ username: "familygamer", password: "1234" })
          .expect(200);
        await agent.get("/api/users/coopstrategist/addresses").expect(403);
    })
});

describe('POST/api/users/:username/orders', () => {
    it('returns a 201 when given correct data', async () => {
        let agent = supertest.agent(app)
        await agent.post('/api/users/login').send({ username: 'familygamer', password: '1234' }).expect(200)
        await agent.post('/api/users/familygamer/orders').send({
            date: '06/06/2024',
            address_id: 3,
            games:[{id:1, qty:3}, {id:2, qty:1}]
        }).expect(201)
    })
    it('returns the correct order object', async () => {
        let agent = supertest.agent(app)
        await agent
          .post("/api/users/login")
          .send({ username: "familygamer", password: "1234" })
          .expect(200);
        let res = await agent
          .post("/api/users/familygamer/orders")
          .send({
            date: "06/06/2024",
            address_id: 3,
            games: [
              { id: 1, qty: 3 },
              { id: 2, qty: 1 },
            ],
          })
            .expect(201);
        expect(res.body.order).toEqual({
            order_id: 6,
            total_price: "13496",
            address_id: 3,
            items: ['Catan', 'Ticket to Ride'],
            username: 'familygamer',
            date:"2024-06-05T23:00:00.000Z"
        })
    })
    it('order containing both games and sleeves', async () => {
        let agent = supertest.agent(app);
        await agent
          .post("/api/users/login")
          .send({ username: "familygamer", password: "1234" })
          .expect(200);
        let res = await agent
          .post("/api/users/familygamer/orders")
          .send({
            date: "06/06/2024",
            address_id: 3,
            games: [
              { id: 1, qty: 3 },
              { id: 2, qty: 1 },
              ],
            sleeves: [
                { id: 1, qty: 2 },
                {id:3, qty:1}
            ]
          })
            .expect(201)
        expect(res.body.order).toEqual({
          order_id: 6,
          total_price: "14793",
          address_id: 3,
            items: ["Catan",
                "Ticket to Ride",
                "Standard Card Sleeves",
                'Mini Card Sleeves'
            ],
          username: "familygamer",
          date: "2024-06-05T23:00:00.000Z",
        });
    })
    it('returns a erorr if qty is > stock', async() => {
         let agent = supertest.agent(app);
         await agent
           .post("/api/users/login")
           .send({ username: "familygamer", password: "1234" })
           .expect(200);
         let res = await agent.post("/api/users/familygamer/orders").send({
           date: "06/06/2024",
           address_id: 3,
           games: [
             { id: 1, qty: 200 },
             { id: 2, qty: 1 },
           ],
         }).expect(400)
    })
})

describe.only('GET/api/users/:username/orders', () => {
    it('returns an array of correct length', async () => {
        let agent = supertest.agent(app);
        await agent.post("/api/users/login").send({ username: "coopstrategist", password: "1234" }).expect(200);
        let res = await agent.get("/api/users/coopstrategist/orders").expect(200);
        expect(res.body.orders.length).toBe(1)
    })
    it('Each element of array has correct keys', async () => {
        let agent = supertest.agent(app);
        await agent
          .post("/api/users/login")
          .send({ username: "familygamer", password: "1234" })
          .expect(200);
        let res = await agent
          .get("/api/users/familygamer/orders")
          .expect(200);
        expect(res.body.orders.length).toBe(2)
        res.body.orders.every((order:any) => expect(order).toEqual(expect.objectContaining({
            address_id: expect.any(Number),
            username: expect.any(String),
            num_items: expect.any(String),
            total_price: expect.any(String),
            order_id:expect.any(Number)
        })))
    })
})
