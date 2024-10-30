import { error } from "console";
import db from "../db";
import { addAllCategoriesToGames, checkAllCategoriesExist, checkCategoryInUse, checkExists } from "../utils";

export function findGames() {
    return db.query(`SELECT games.*, avg(reviews.rating) AS average_review, count(reviews.rating) AS num_reviews FROM games LEFT JOIN reviews ON (games.game_id = reviews.entity_id AND reviews.entity_type = 'games') GROUP BY games.game_id;`)
        .then(res => res.rows)
        .then(games => games.map((element) => {
            //these are of type bigint which gets cast to string
            //converting to number types
            element.average_review = Number(element.average_review) 
            element.num_reviews = Number(element.num_reviews)
            return element
        }))
}
export async function findGame(game_id: any) {
    await checkExists('games', 'game_id', [game_id])
    return db
      .query(
          `SELECT games.*, avg(reviews.rating) AS average_review, count(reviews.rating) AS num_reviews FROM games 
          LEFT JOIN reviews ON (games.game_id = reviews.entity_id AND reviews.entity_type = 'games')
          WHERE games.game_id = $1
          GROUP BY games.game_id ;`,
        [game_id]
      )
        .then((res) => res.rows[0])
        .then((game) => {
            game.num_reviews = Number(game.num_reviews)
            game.average_review = Number(game.average_review)
            return game
        })
}

export async function findGameReviews(game_id: any) {
    await checkExists('games', 'game_id', [game_id])
    const reviews = (await db.query(`SELECT * FROM reviews WHERE (entity_type = 'games' AND entity_id = $1)`, [game_id])).rows
    return reviews
    
}

export async function addGame(game: Game) {
    const { categories, name, price, stock, game_body, bgg_id } = game
    // check if category name exists for all categories if any do not exist throw an error
    await checkAllCategoriesExist(categories)
    const insertedGame = (await db.query(`INSERT INTO games (name, stock, price, game_body, bgg_id) VALUES ($1,$2,$3,$4,$5) RETURNING *`,
        [name, stock, price, game_body, bgg_id]
    )).rows[0]
    // add categories to category game join table 
    await categories.every(async (category: string) => await db.query(`INSERT INTO games_categories (game_id, category_name) VALUES ($1, $2);`,
        [insertedGame.game_id, category]))
    return insertedGame
    
}

export async function removeGame(id: any) {
    await checkExists('games','game_id',[id])
    let game = await db.query(`DELETE FROM games WHERE game_id = $1 RETURNING *`, [id])
    return game.rows
}

export async function addCategoriesToGame(categories: string[], game_id: any) {
    await checkExists("games", "game_id", [game_id]);
    await checkAllCategoriesExist(categories)
    let game:any = await addAllCategoriesToGames(categories, game_id)
    return game.rows[0]
}