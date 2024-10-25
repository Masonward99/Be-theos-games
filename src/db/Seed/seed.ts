import format from 'pg-format'
import db from '../../db.js'

const dropTables = () => {
    return db.query(`DROP TABLE IF EXISTS order_items`)
        .then(() => db.query(`DROP TABLE IF EXISTS orders`))
        .then(() => db.query(`DROP TABLE IF EXISTS addresses`))
        .then(() => db.query(`DROP TABLE IF EXISTS reviews`))
        .then(() => db.query(`DROP TABLE IF EXISTS images`))
        .then(() => db.query(`DROP TABLE IF EXISTS games_categories`))
        .then(() => db.query(`DROP TABLE IF EXISTS cards`))
        .then(() => db.query(`DROP TABLE IF EXISTS sleeves`))
        .then(() => db.query(`DROP TABLE IF EXISTS categories`))
        .then(() => db.query(`DROP TABLE IF EXISTS users`))
        .then(() => db.query(`DROP TABLE IF EXISTS games`))
}

const createTables = () => {
    
}
export default dropTables