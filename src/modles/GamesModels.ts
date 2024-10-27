import { error } from "console";
import db from "../db";

export function findGames() {
    return db.query(`SELECT * FROM games;`)
        .then(res => res.rows)
}
export function findGame(game_id:any) {
    return db.query(`SELECT * FROM games WHERE game_id = $1`, [game_id])
        .then(res => res.rows[0])
}