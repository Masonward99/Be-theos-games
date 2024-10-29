import supertest from "supertest";
import { seed } from "../db/Seed/seed";
import { testData } from "../db/data/test-data/test-data";
import app from "../app";
import db from "../db";


beforeEach(async () => await seed(testData))
afterAll(() => db.end())

describe('GET/api/games', () => {
    it('returns an array of the correct length', () => {
        return supertest(app).get(`/api/games`)
            .expect(200)
            .then(res=> expect(res.body.games.length ).toBe(16))
    })
    it('returns an array of objects with the correct keys', () => {
        return supertest(app).get(`/api/games`)
            .expect(200)
            .then(res => {
                let gamesArr = res.body.games
                gamesArr.every((game:Game) => {
                    expect(game).toEqual(expect.objectContaining({
                        game_id: expect.any(Number),
                        stock: expect.any(Number),
                        game_body: expect.any(String),
                        name: expect.any(String),
                        price: expect.any(Number),
                        bgg_id: expect.any(Number),
                        average_review: expect.any(Number),
                        num_reviews: expect.any(Number)
                    }))
                })
        })
    })
})

describe(`GET/api/games/:game_id`, () => {
    it('returns the correct object when given a valid id', () => {
        return supertest(app).get(`/api/games/10`)
            .expect(200)
            .then(res => {
                let game = res.body.game
              expect(game).toEqual({
                game_id: 10,
                stock: 9,
                game_body:
                  "A game of civilization-building through three ages, where players collect resources, build structures, and develop their city to win.",
                name: "7 Wonders",
                price: 2599,
                bgg_id: 123789,
                num_reviews: 0,
                average_review:0
              });
        })
    })
  it('returns a 404 if game does not exist', () => {
    return supertest(app).get(`/api/games/20`)
      .expect(404)
  })
  it('returns a 400 error if game_id is not a number', () => {
    return supertest(app).get(`/api/games/cat`)
    .expect(400)
  })
})

describe('GET/api/games/:game_id/reviews', () => {
  it('returns an array of reviews', () => {
    return supertest(app).get('/api/games/4/reviews')
      .expect(200)
      .then((res) => {
        let reviews = res.body.reviews
        reviews.every((review: any) => {
          expect(review).toEqual(expect.objectContaining({
            entity_type: expect.any(String),
            entity_id: expect.any(Number),
            rating: expect.any(Number),
            review_id: expect.any(Number),
            author: expect.any(String),
            review_body: expect.any(String),
            review_title: expect.any(String),
            created_at: expect.any(String)
          }))
        })
    } )
  })
  it('returns a 404 if game does not exist', () => {
    return supertest(app).get(`/api/games/20/reviews`)
      .expect(404)
  })
  it('returns a 400 if the game id is of the wrong type', () => {
    return supertest(app).get(`/api/games/cat/reviews`)
      .expect(400)
  })
  it('returns an empty array if there are no reviews on that game', () => {
    return supertest(app).get('/api/games/10/reviews')
      .expect(200)
      .then(res => expect(res.body.reviews.length).toBe(0))
  })
  it('returns an array of the correct length', () => {
    return supertest(app).get('/api/games/4/reviews')
      .expect(200)
      .then(res => expect(res.body.reviews.length).toBe(2))
  })
})