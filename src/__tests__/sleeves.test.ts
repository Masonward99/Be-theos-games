import supertest from 'supertest'
import { seed } from '../db/Seed/seed'
import { testData } from '../db/data/test-data/test-data'
import app from '../app'
import db from '../db'

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

describe('GET/api/sleeves/:sleeve_id/reviews', () => {
  it('Returns a 200 when give a valid id', async () => {
    await supertest(app).get('/api/sleeves/2/reviews').expect(200)
  })
  it('Returns an array of the correct length', async () => {
    let res = await supertest(app).get('/api/sleeves/1/reviews').expect(200)
    expect(res.body.reviews.length).toBe(2)
  })
  it('Returns an empty array if there are no reviews', async () => {
    let res = await supertest(app).get('/api/sleeves/10/reviews').expect(200)
    expect(res.body.reviews).toEqual([])
  })
  it('Returns an array with correct keys', async () => {
    let res = await supertest(app).get('/api/sleeves/1/reviews').expect(200)
    res.body.reviews.every((review: any) =>
      expect(review).toEqual(
        expect.objectContaining({
          entity_type: expect.any(String),
          entity_id: expect.any(Number),
          rating: expect.any(Number),
          review_id: expect.any(Number),
          author: expect.any(String),
          review_body: expect.any(String),
          review_title: expect.any(String),
          created_at: expect.any(String),
        })
      )
    );
  })
  it('Returns a 404 if sleeve_id doesnt exist', async () => {
    await supertest(app).get('/api/sleeves/20/reviews').expect(404)
  })
  it('Returns a 400 error if sleeve id is invalid', async () => {
    await supertest(app).get('/api/sleeves/cat/reviews').expect(400)
  })
})

describe("POST/api/sleeves/:sleeve_id/reviews", () => {
  const review = {
    rating: 4,
    review_title: 'a review',
    review_body: 'This is a good review',
    created_at: '2024/06/06',
    author: 'econwizard'
  }
  it("Returns a 201 when give the correct data", async () => {
    await supertest(app).post('/api/sleeves/1/reviews').send(review).expect(201)
  })
  it("Returns the created review", async () => {
    let res = await supertest(app).post('/api/sleeves/1/reviews').send(review).expect(201)
    expect(res.body.review).toEqual({
      rating: 4,
      review_title: "a review",
      review_body: "This is a good review",
      created_at: "2024-06-05T23:00:00.000Z",
      author: "econwizard",
      entity_id: 1,
      entity_type: 'sleeves',
      review_id:23
    });
  })
  it('returns a 404 error if review does not exist', async () => {
    await supertest(app).post('/api/sleeves/20/reviews').send(review).expect(404)
  })
  it('returns a 400 error if given a invalid id', async () => {
    await supertest(app).post('/api/sleeves/cat/reviews').send(review).expect(400)
  })
  it('returns a 400 error if author does not exist', async () => {
    review.author = 'mason';
    await supertest(app).post('/api/sleeves/1/reviews').send(review).expect(400)
  })
})