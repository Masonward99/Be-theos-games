import supertest from "supertest"; 'supertest'
import { beforeEach, describe } from "node:test";
import { seed } from "../db/Seed/seed";
import { testData } from "../db/data/test-data/test-data";
import app from "../app";
import db from "../db";

afterAll(() => db.end())
console.log(db.options.database)
describe('GET/api/games', () => {
    beforeEach(async () =>await seed(testData))
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