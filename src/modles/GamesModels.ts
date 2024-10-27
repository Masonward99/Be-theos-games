import db from "../db";

export function findGames() {
    return db.query(`SELECT * FROM GAMES`)
        .then(res => res.rows)
}