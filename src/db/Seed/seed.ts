import format from 'pg-format'
import db from '../../db'

const dropTables = () => {
    return db.query(`DROP TABLE IF EXISTS order_items;`)
        .then(() => db.query(`DROP TABLE IF EXISTS orders;`))
        .then(() => db.query(`DROP TABLE IF EXISTS addresses;`))
        .then(() => db.query(`DROP TABLE IF EXISTS reviews;`))
        .then(() => db.query(`DROP TABLE IF EXISTS images;`))
        .then(() => db.query(`DROP TABLE IF EXISTS games_categories;`))
        .then(() => db.query(`DROP TABLE IF EXISTS cards;`))
        .then(() => db.query(`DROP TABLE IF EXISTS sleeves;`))
        .then(() => db.query(`DROP TABLE IF EXISTS categories;`))
        .then(() => db.query(`DROP TABLE IF EXISTS users;`))
        .then(() => db.query(`DROP TABLE IF EXISTS games;`))
}

const createTables = () => {
    return db
      .query(
        `CREATE TABLE games (
        game_id SERIAL PRIMARY KEY,
        name VARCHAR,
        price INT NOT NULL CHECK(price >= 0),
        stock INT NOT NULL CHECK(stock >= 0),
        game_body TEXT,
        bgg_id INT);`
      )
      .then(() =>
        db.query(`CREATE TABLE categories (
        category_name VARCHAR PRIMARY KEY,
        description TEXT);`)
      )
      .then(() =>
        db.query(`CREATE TABLE sleeves (
        sleeve_id SERIAL PRIMARY KEY,
        sleeve_name VARCHAR,
        price INT,
        stock INT,
        height INT,
        width INT,
        pack_size INT,
        description TEXT);`)
      )
      .then(() =>
        db.query(`CREATE TABLE users (
        username VARCHAR PRIMARY KEY,
        first_name VARCHAR,
        last_name VARCHAR,
        dob DATE,
        email VARCHAR,
        title VARCHAR,
        password VARCHAR  NOT NULL);`)
      )
      .then(() =>
        db.query(`CREATE TABLE cards (
        card_id SERIAL PRIMARY KEY,
        card_name VARCHAR NOT NULL,
        height INT NOT NULL,
        width INT NOT NULL,
        game_id INT NOT NULL REFERENCES games(game_id) ON DELETE CASCADE,
        qty INT NOT NULL);`)
      )
      .then(() =>
        db.query(`CREATE TABLE games_categories (
        id SERIAL PRIMARY KEY,
        game_id INT REFERENCES games(game_id) ON DELETE CASCADE,
        category_name VARCHAR REFERENCES categories(category_name));`)
      )
      .then(() =>
        db.query(`CREATE TABLE addresses (
        address_id SERIAL PRIMARY KEY,
        postcode VARCHAR,
        city  VARCHAR,
        address_line1 VARCHAR,
        username VARCHAR REFERENCES users(username));`)
      )
      .then(() =>
        db.query(`CREATE TABLE orders (
        order_id SERIAL PRIMARY KEY,
        address_id INT REFERENCES addresses(address_id),
        user_id VARCHAR REFERENCES users(username),
        date DATE);`)
      )
      .then(() =>
        db.query(`CREATE TABLE reviews (
        review_id SERIAL PRIMARY KEY,
        entity_id INT,
        entity_type VARCHAR,
        rating INT,
        author VARCHAR REFERENCES users(username),
        review_body TEXT,
        review_title VARCHAR,
        created_at DATE);`)
      )
      .then(() =>
        db.query(`CREATE TABLE images (
        image_id SERIAL PRIMARY KEY,
        image_url VARCHAR,
        alt_text VARCHAR,
        entity_type VARCHAR,
        entity_id INT);`)
      )
      .then(() =>
        db.query(`CREATE TABLE order_items (
        item_id SERIAL PRIMARY KEY,
        entity_type VARCHAR,
        entity_id INT,
        qty INT,
        entity_name VARCHAR,
        order_id INT REFERENCES orders(order_id));`)
      );
}

const addData = (data: SeedData) => {
  const { games, categories, users, sleeves, gameCards, gameCategories, reviews, addresses} = data; 
  const insertGamesQueryStr = format(`INSERT INTO games (name, price, stock, game_body, bgg_id) VALUES %L;`, 
    games.map(({ name , price, stock, game_body, bgg_id }) => [name, price, stock, game_body, bgg_id])
  )
  return db.query(insertGamesQueryStr)
    .then(() => {
      const insertCategoriesQueryStr = format(`INSERT INTO categories (category_name, description) VALUES %L;`,
        categories.map(({ name, description }) => [name, description])
      )
      return db.query(insertCategoriesQueryStr)
    })
    .then(() => {
      const insertUsersQueryStr = format(`INSERT INTO users (username, first_name, last_name, dob, email, password, title) VALUES %L;`,
      users.map(({username, first_name, last_name, dob, email, password, title}) => [username, first_name, last_name, dob, email, password, title])
      )
      return db.query(insertUsersQueryStr)
    })
    .then(() => {
      const insertSleevesQueryStr = format(`INSERT INTO sleeves (sleeve_name, price, stock, height, width, pack_size, description) VALUES %L;`,
        sleeves.map(({name, height, width, pack_size, stock, description, price})=> [name, price, stock, height, width, pack_size, description])
      )
      return db.query(insertSleevesQueryStr)
    })
    .then(() => {
      const insertCardsQueryStr = format(`INSERT INTO cards (card_name, height, width, game_id, qty) VALUES %L;`,
      gameCards.map(({name, height, width, game_id, qty})=>[name, height, width, game_id, qty])
      )
      return db.query(insertCardsQueryStr)
    })
    .then(() => {
      const insertGameCategoriesQueryStr = format(`INSERT INTO games_categories (game_id, category_name) VALUES %L;`,
        gameCategories.map(({ game_id, category_name }) => [game_id, category_name])
      )
      return db.query(insertGameCategoriesQueryStr)
    })
    .then(() => {
      const insertReviewsQueryStr = format(`INSERT INTO reviews (entity_id, entity_type, rating, author, review_body, review_title, created_at) VALUES %L;`,
      reviews.map(({entity_type, entity_id, rating, review_body, review_title, author, created_at})=> [entity_id, entity_type, rating, author, review_body, review_title, created_at])
      )
      return db.query(insertReviewsQueryStr)
    })
    .then(() => {
      const insertAddressesQueryStr = format(`INSERT INTO addresses (postcode, city, address_line1, username) VALUES %L;`,
      addresses.map(({ postcode, city, address_line1, username }) => [postcode, city, address_line1, username]))
      return db.query(insertAddressesQueryStr)
      
  })
}

export const seed = (seedData: SeedData) => {
  return dropTables()
    .then(() => createTables())
    .then(()=> addData(seedData))
}
