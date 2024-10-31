import supertest from 'supertest'
import { seed } from '../db/Seed/seed'
import { testData } from '../db/data/test-data/test-data'
import app from '../app'
import db from '../db'
import { reviews } from '../db/data/test-data/reviews'

beforeEach(async () => await seed(testData))
afterAll(() => db.end())

describe('GET/api/sleeves', () => {
  it('returns a 200', async () => {
    await supertest(app).get('/api/sleeves').expect(200)
  })
  it('returns an array of correct length', async () => {
    let res = await supertest(app).get('/api/sleeves').expect(200)
    expect(res.body.sleeves.length).toBe(10)
  })
  it('Each sleeve has the correct keys', async () => {
    let res = await supertest(app).get('/api/sleeves').expect(200)
    const { sleeves } = res.body
    sleeves.every((sleeve: any) =>
      expect(sleeve).toEqual(
        expect.objectContaining({
          sleeve_id: expect.any(Number),
          sleeve_name: expect.any(String),
          price: expect.any(Number),
          stock: expect.any(Number),
          height: expect.any(Number),
          width: expect.any(Number),
          pack_size: expect.any(Number),
          description: expect.any(String),
          average_review: expect.any(String),
          num_reviews:expect.any(String)
        })
      )
    );
  })
})

describe("POST/api/sleeves", () => {
  const sleeve:any = {
    sleeve_name: "Ultra Pro Standard Sleeves",
    price: 1000,
    stock: 200,
    height: 88,
    width: 63,
    pack_size: 50,
    description: "Standard sleeves for card protection.",
  }
  it('Returns a 201 when the correct body is added', async () => {
    await supertest(app).post('/api/sleeves').send(sleeve).expect(201)
  })
  it('Returns the created sleeve object', async() => {
    let res = await supertest(app).post('/api/sleeves').send(sleeve).expect(201)
    expect(res.body.sleeve).toEqual({sleeve_id:11, ...sleeve})
  })
  it('Returns a 400 if a numerical value is a string', async () => {
    sleeve.width = 'cat'
    await supertest(app).post('/api/sleeves').send(sleeve).expect(400)
  })
  it('Returns a 400 error if a value is missing', async () => {
    delete sleeve['width']
    await supertest(app).post('/api/sleeves').send(sleeve).expect(400)
  })
})

describe("GET/api/sleeves/:sleeve_id", () => {
  it('Returns a 201 when given a valid id', async () => {
    await supertest(app).get('/api/sleeves/10').expect(200)
  })
  it('Returns a sleeve object including the average reviews', async () => {
    let res = await supertest(app).get('/api/sleeves/10').expect(200)
    expect(res.body.sleeve).toEqual({
      sleeve_name: "Eco-Friendly Sleeves",
      price: 499,
      stock: 70,
      height: 88,
      width: 63,
      pack_size: 100,
      description:
        "Biodegradable sleeves made from eco-friendly materials, offering protection while reducing environmental impact.",
      num_reviews: '0',
      average_review: null,
      sleeve_id:10
    });
  })
  it('returns a 404 if id is valid but doesnt exist', async () => {
    await supertest(app).get('/api/sleeves/11').expect(404)
  })
  it('returns a 400 error if id is not a number', async () => {
    await supertest(app).get('/api/sleeves/cat').expect(400)
  })
})

describe('DELETE /api/sleeves/:sleeve_id', () => {
  it('Returns a 204 when given a valid id', async() => {
    await supertest(app).delete('/api/sleeves/1').expect(204)
  })
  it('Deletes the sleeve at that id', async () => {
    await supertest(app).delete('/api/sleeves/1').expect(204)
    await supertest(app).get('/api/sleeves/1').expect(404)
  })
  it("Deletes all reviews on that sleeve", async () => {
    await supertest(app).delete('/api/sleeves/1').expect(204)
    let res = await db.query(`SELECT * FROM reviews WHERE (entity_type = 'sleeves' AND entity_id = 1)`)
    expect(res.rows.length).toBe(0)
  })
  it("returns 404 if id doesnt exist", async () => {
    await supertest(app).delete('/api/sleeves/40').expect(404)
  })
  it('returns a 400 for a invalid id', async () => {
    await supertest(app).delete('/api/sleeves/cat').expect(400)
  })
})