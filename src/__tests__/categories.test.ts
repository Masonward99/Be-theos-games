import supertest from 'supertest'
import { seed } from '../db/Seed/seed'
import { testData } from '../db/data/test-data/test-data'
import app from '../app'
import db from '../db'

beforeEach(async () => await seed(testData))
afterAll(()=>db.end())
describe('GET/api/categories', () => {
  it('returns an array of correct length', async() => {
    const response = await supertest(app).get('/api/categories').expect(200)
    expect(response.body.categories.length).toBe(10)
  })
  it('Each element of categories has the correct keys', async () => {
    const categories = (await supertest(app).get('/api/categories').expect(200)).body.categories
    categories.every((category:any) => expect(category).toEqual(expect.objectContaining({
      category_name: expect.any(String),
      description: expect.any(String),
      num_games: expect.any(String)
    })))
  })
})