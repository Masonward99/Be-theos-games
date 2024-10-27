import supertest from "supertest"; 'supertest'
import { seed } from "../db/Seed/seed";
import { testData } from "../db/data/test-data/test-data";
import app from "../app";
import db from "../db";
import exp from "constants";

beforeEach(async () =>await seed(testData))
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
                        bgg_id: expect.any(Number)
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