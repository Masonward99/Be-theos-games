import { error } from "console";
import db from "../db";
import { checkExists } from "../utils";

export function findGames() {
    return db.query(`SELECT * FROM games;`)
        .then(res => res.rows)
}
export async function findGame(game_id: any) {
    await checkExists('games', 'game_id', [game_id])
    return db.query(`SELECT * FROM games WHERE game_id = $1`, [game_id])
        .then(res => res.rows[0])
}