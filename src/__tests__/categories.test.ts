import supertest from 'supertest'
import { seed } from '../db/Seed/seed'
import { testData } from '../db/data/test-data/test-data'
import app from '../app'
import db from '../db'

beforeEach(async () => await seed(testData))
afterAll(() => db.end())

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

describe('Post/api/categories', () => {
  it('Returns a 201 and the newly created category if given correct data', async() => {
    const category = await supertest(app).post('/api/categories').send({ category_name: 'test-category', description: 'this is a new category' }).expect(201)
    expect(category.body.category).toEqual({ category_name: 'test-category', description: 'this is a new category' })
  })
  it('Returns a 409 if the category name already exists', async () => {
    await supertest(app).post('/api/categories').send({category_name:'strategy', description:'A game of strategy'}).expect(409)
  })
  it('Returns a 400 error if category name is not included', async () => {
    await supertest(app).post('/api/categories').send({description:'my new category'}).expect(400)
  })
  it('Returns a 400 error if category name is not a string', async() => {
    await supertest(app).post('/api/categories').send({ category_name: 12, description: 'a nice description' })
  })
});