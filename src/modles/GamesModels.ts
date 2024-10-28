import { error } from "console";
import db from "../db";
import { checkExists } from "../utils";

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