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
describe('POST/api/games', () => {
  const game = {
    name: 'ticket to ride',
    stock: 50,
    price: 40,
    game_body: 'A game about trains',
    bgg_id: 12345,
    categories: ['strategy', 'family']
  }
  it('returns a 201 when given a suitable body', async () => {
    let response = await supertest(app).post('/api/games').send(game).expect(201)
  })
  it('returns the created game object', async () => {
    let response = await supertest(app).post('/api/games').send(game).expect(201)
    expect(response.body.game).toEqual({
      name: "ticket to ride",
      stock: 50,
      price: 40,
      game_body: "A game about trains",
      bgg_id: 12345,
      game_id:17
    });
  })
  it('returns a 400 error if category does not exist', async () => {
    let response = await supertest(app).post('/api/games').send({
      name: 'ticket to ride',
       stock: 50,
      price: 40,
      game_body: "A game about trains",
      bgg_id: 12345,
      categories:['strategy', 'goblin']
    }).expect(400)
  })
  it('adds the categories to the category join table', async () => { 
    let response = await supertest(app).post('/api/games').send(game).expect(201)
    let gameCategories = await db.query("SELECT * FROM games_categories WHERE game_id = 17")
    expect(gameCategories.rows.length).toBe(2)
    expect(gameCategories.rows[0]).toEqual({
      game_id: 17,
      category_name: 'strategy',
      id:20
    })
  })
})

describe('DELETE/api/games/:game_id', () => {
  it('Returns a 204 when given a valid id ', async () => {
    await supertest(app).delete('/api/games/10').expect(204)
  })
  it('Removes the game from the games table', async () => {
    await supertest(app).delete('/api/games/10').expect(204)
    let game = await db.query('SELECT * FROM games WHERE game_id = 10')
    expect(game.rows.length).toBe(0)
  })
  it('Returns a 404 error if game_id does not exist', async () => {
    await supertest(app).delete('/api/games/20').expect(404)
  })
  it('Returns a 400 error if the game_id is not a number', async() => {
    await supertest(app).delete('/api/games/cat').expect(400)
  })
  it('Can delete games where other tables depend on the game_id', async () => {
    await supertest(app).delete('/api/games/1').expect(204)
  })
  it("delete all reviews on the game", async () => {
    await supertest(app).delete('/api/games/1').expect(204)
    let res = await db.query(`SELECT * FROM reviews WHERE (entity_type ='games' AND entity_id = 1)`)
    expect(res.rows.length).toBe(0)
  })
})
describe('POST/api/games/game_id/categories', () => {
  it('returns a 201 when categories are added', async() => {
    await supertest(app)
      .post("/api/games/1/categories")
      .send({ categories: ["party"] })
      .expect(201);
  })
  it('returns a body with the correct keys', async () => {
    let response = await supertest(app).post('/api/games/1/categories').send({ categories: ["party"] }).expect(201)
    expect(response.body.game).toEqual({
      game_id: 1,
      name: "Catan",
      price: 3499,
      stock: 20,
      game_body:
        "A strategy game where players collect resources and use them to build roads, settlements, and cities. Aim to become the dominant force on the island of Catan!",
      bgg_id: 123456,
      average_review: "4.5000000000000000",
      categories: ["family", "party", "strategy"],
      num_reviews: "2",
    });
  })
  it('returns a 400 error if category name does not exist', async() => {
    await supertest(app).post('/api/games/1/categories').send({categories: 'hello'}).expect(400)
  })
  it('Returns a 404 if game does not exist', async () => {
    await supertest(app).post('/api/games/25/categories').send({categories:'family'}).expect(404)
  })
  it('Returns a 400 error if game id is invalid', async () => {
    await supertest(app).post('/api/games/cat/categories').send({categories:'family'}).expect(400)
  })
  it('Can add multiple categories', async() => {
     let response = await supertest(app)
       .post("/api/games/1/categories")
       .send({ categories: ["party", 'horror'] })
       .expect(201);
     expect(response.body.game).toEqual({
       game_id: 1,
       name: "Catan",
       price: 3499,
       stock: 20,
       game_body:
         "A strategy game where players collect resources and use them to build roads, settlements, and cities. Aim to become the dominant force on the island of Catan!",
       bgg_id: 123456,
       average_review: "4.5000000000000000",
       categories: ["family", "horror", "party", "strategy" ],
       num_reviews: "2",
     });
  })
})

describe('delete/api/games/:game_id/categories/:category_name', () => {
  it('returns a 204 when given a category and game that exists', async() => {
    await supertest(app).delete('/api/games/1/categories/strategy').expect(204)
  })
  it('returns a 404 erorr if game does not exist', async () => {
    await supertest(app).delete('/api/games/25/categories/strategy').expect(404)
  })
  it('returns a 404 error if category does not exist', async () => {
    await supertest(app).delete('/api/games/1/categories/hello').expect(404)
  })
  it('returns a 400 error if game_id is invalid', async () => {
    await supertest(app).delete("/api/games/cat/categories/strategy").expect(400);
  })
  it('delete the category from the game', async () => {
    await supertest(app).delete("/api/games/1/categories/strategy").expect(204);
    let game = await db.query(
      "SELECT * FROM games_categories WHERE game_id = 1;"
    );
    expect(game.rows.length).toBe(1)
  })
})

describe('PATCH/api/games/:game_id', () => {
  it('returns a 200 if the request is valid', async() => {
    await supertest(app).patch('/api/games/1').send({inc_stock:5, price: 7000}).expect(200)
  })
  it('returns the expected object', async () => {
    let game = await supertest(app)
      .patch("/api/games/1")
      .send({ inc_stock: 5, price: 7000 })
      .expect(200);
    expect(game.body.game).toEqual({
      game_id: 1,
      name: "Catan",
      price: 7000,
      stock: 25,
      game_body:
        "A strategy game where players collect resources and use them to build roads, settlements, and cities. Aim to become the dominant force on the island of Catan!",
      bgg_id: 123456,
    });
  })
  it('Can change the price', async() => {
    let game = await supertest(app)
      .patch("/api/games/1")
      .send({  price: 20000 })
      .expect(200);
    expect(game.body.game).toEqual({
      game_id: 1,
      name: "Catan",
      price: 20000,
      stock: 20,
      game_body:
        "A strategy game where players collect resources and use them to build roads, settlements, and cities. Aim to become the dominant force on the island of Catan!",
      bgg_id: 123456,
    });
  })
  it('Can change the stock', async() => {
    let game = await supertest(app)
      .patch("/api/games/1")
      .send({ inc_stock: 5 })
      .expect(200);
    expect(game.body.game).toEqual({
      game_id: 1,
      name: "Catan",
      price: 3499,
      stock: 25,
      game_body:
        "A strategy game where players collect resources and use them to build roads, settlements, and cities. Aim to become the dominant force on the island of Catan!",
      bgg_id: 123456,
    });
  })
  it('Returns an error if stock is negative after increment', async () => {
    await supertest(app).patch('/api/games/1').send({inc_stock: -100}).expect(400)
  })
  it('returns an error if price is negative', async () => {
   await supertest(app).patch('/api/games/1').send({price:-100}).expect(400)
  })
})