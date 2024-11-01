"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seed = void 0;
const pg_format_1 = __importDefault(require("pg-format"));
const db_1 = __importDefault(require("../../db"));
const dropTables = () => {
    return db_1.default.query(`DROP TABLE IF EXISTS order_items;`)
        .then(() => db_1.default.query(`DROP TABLE IF EXISTS orders;`))
        .then(() => db_1.default.query(`DROP TABLE IF EXISTS addresses;`))
        .then(() => db_1.default.query(`DROP TABLE IF EXISTS reviews;`))
        .then(() => db_1.default.query(`DROP TABLE IF EXISTS images;`))
        .then(() => db_1.default.query(`DROP TABLE IF EXISTS games_categories;`))
        .then(() => db_1.default.query(`DROP TABLE IF EXISTS cards;`))
        .then(() => db_1.default.query(`DROP TABLE IF EXISTS sleeves;`))
        .then(() => db_1.default.query(`DROP TABLE IF EXISTS categories;`))
        .then(() => db_1.default.query(`DROP TABLE IF EXISTS users;`))
        .then(() => db_1.default.query(`DROP TABLE IF EXISTS games;`));
};
const createTables = () => {
    return db_1.default
        .query(`CREATE TABLE games (
        game_id SERIAL PRIMARY KEY,
        name VARCHAR,
        price INT NOT NULL CHECK(price >= 0),
        stock INT NOT NULL CHECK(stock >= 0),
        game_body TEXT,
        bgg_id INT);`)
        .then(() => db_1.default.query(`CREATE TABLE categories (
        category_name VARCHAR PRIMARY KEY,
        description TEXT);`))
        .then(() => db_1.default.query(`CREATE TABLE sleeves (
        sleeve_id SERIAL PRIMARY KEY,
        sleeve_name VARCHAR NOT NULL,
        price INT NOT NULL,
        stock INT NOT NULL,
        height INT NOT NULL,
        width INT NOT NULL,
        pack_size INT NOT NULL,
        description TEXT NOT NULL);`))
        .then(() => db_1.default.query(`CREATE TABLE users (
        username VARCHAR PRIMARY KEY,
        first_name VARCHAR,
        last_name VARCHAR,
        dob DATE,
        email VARCHAR,
        title VARCHAR,
        password VARCHAR  NOT NULL);`))
        .then(() => db_1.default.query(`CREATE TABLE cards (
        card_id SERIAL PRIMARY KEY,
        card_name VARCHAR NOT NULL,
        height INT NOT NULL,
        width INT NOT NULL,
        game_id INT NOT NULL REFERENCES games(game_id) ON DELETE CASCADE,
        qty INT NOT NULL);`))
        .then(() => db_1.default.query(`CREATE TABLE games_categories (
        id SERIAL PRIMARY KEY,
        game_id INT REFERENCES games(game_id) ON DELETE CASCADE,
        category_name VARCHAR REFERENCES categories(category_name));`))
        .then(() => db_1.default.query(`CREATE TABLE addresses (
        address_id SERIAL PRIMARY KEY,
        postcode VARCHAR,
        city  VARCHAR,
        address_line1 VARCHAR,
        username VARCHAR REFERENCES users(username));`))
        .then(() => db_1.default.query(`CREATE TABLE orders (
        order_id SERIAL PRIMARY KEY,
        address_id INT NULL REFERENCES addresses(address_id) ON DELETE SET NULL,
        username VARCHAR REFERENCES users(username),
        date DATE);`))
        .then(() => db_1.default.query(`CREATE TABLE reviews (
        review_id SERIAL PRIMARY KEY,
        entity_id INT,
        entity_type VARCHAR,
        rating INT,
        author VARCHAR REFERENCES users(username),
        review_body TEXT,
        review_title VARCHAR,
        created_at DATE);`))
        .then(() => db_1.default.query(`CREATE TABLE images (
        image_id SERIAL PRIMARY KEY,
        image_url VARCHAR,
        alt_text VARCHAR,
        entity_type VARCHAR,
        entity_id INT);`))
        .then(() => db_1.default.query(`CREATE TABLE order_items (
        item_id SERIAL PRIMARY KEY,
        name VARCHAR,
        qty INT,
        price INT,
        order_id INT REFERENCES orders(order_id));`));
};
const addData = (data) => {
    const { games, categories, users, sleeves, gameCards, gameCategories, reviews, addresses, orders, orderItems } = data;
    const insertGamesQueryStr = (0, pg_format_1.default)(`INSERT INTO games (name, price, stock, game_body, bgg_id) VALUES %L;`, games.map(({ name, price, stock, game_body, bgg_id }) => [name, price, stock, game_body, bgg_id]));
    return db_1.default.query(insertGamesQueryStr)
        .then(() => {
        const insertCategoriesQueryStr = (0, pg_format_1.default)(`INSERT INTO categories (category_name, description) VALUES %L;`, categories.map(({ name, description }) => [name, description]));
        return db_1.default.query(insertCategoriesQueryStr);
    })
        .then(() => {
        const insertUsersQueryStr = (0, pg_format_1.default)(`INSERT INTO users (username, first_name, last_name, dob, email, password, title) VALUES %L;`, users.map(({ username, first_name, last_name, dob, email, password, title }) => [username, first_name, last_name, dob, email, password, title]));
        return db_1.default.query(insertUsersQueryStr);
    })
        .then(() => {
        const insertSleevesQueryStr = (0, pg_format_1.default)(`INSERT INTO sleeves (sleeve_name, price, stock, height, width, pack_size, description) VALUES %L;`, sleeves.map(({ name, height, width, pack_size, stock, description, price }) => [name, price, stock, height, width, pack_size, description]));
        return db_1.default.query(insertSleevesQueryStr);
    })
        .then(() => {
        const insertCardsQueryStr = (0, pg_format_1.default)(`INSERT INTO cards (card_name, height, width, game_id, qty) VALUES %L;`, gameCards.map(({ name, height, width, game_id, qty }) => [name, height, width, game_id, qty]));
        return db_1.default.query(insertCardsQueryStr);
    })
        .then(() => {
        const insertGameCategoriesQueryStr = (0, pg_format_1.default)(`INSERT INTO games_categories (game_id, category_name) VALUES %L;`, gameCategories.map(({ game_id, category_name }) => [game_id, category_name]));
        return db_1.default.query(insertGameCategoriesQueryStr);
    })
        .then(() => {
        const insertReviewsQueryStr = (0, pg_format_1.default)(`INSERT INTO reviews (entity_id, entity_type, rating, author, review_body, review_title, created_at) VALUES %L;`, reviews.map(({ entity_type, entity_id, rating, review_body, review_title, author, created_at }) => [entity_id, entity_type, rating, author, review_body, review_title, created_at]));
        return db_1.default.query(insertReviewsQueryStr);
    })
        .then(() => {
        const insertAddressesQueryStr = (0, pg_format_1.default)(`INSERT INTO addresses (postcode, city, address_line1, username) VALUES %L;`, addresses.map(({ postcode, city, address_line1, username }) => [postcode, city, address_line1, username]));
        return db_1.default.query(insertAddressesQueryStr);
    })
        .then(() => {
        const insertOrdersQueryStr = (0, pg_format_1.default)(`INSERT INTO orders (address_id, username, date) VALUES %L;`, orders.map(({ address_id, username, date }) => [address_id, username, date]));
        return db_1.default.query(insertOrdersQueryStr);
    })
        .then(() => {
        const insertOrderItemsQueryStr = (0, pg_format_1.default)(`INSERT INTO order_items (name, qty, price, order_id) VALUES %L;`, orderItems.map(({ name, price, qty, order_id }) => [name, price, qty, order_id]));
        return db_1.default.query(insertOrderItemsQueryStr);
    });
};
const seed = (seedData) => {
    return dropTables()
        .then(() => createTables())
        .then(() => addData(seedData));
};
exports.seed = seed;
