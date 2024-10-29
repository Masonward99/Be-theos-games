"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findGames = findGames;
exports.findGame = findGame;
exports.findGameReviews = findGameReviews;
const db_1 = __importDefault(require("../db"));
const utils_1 = require("../utils");
function findGames() {
    return db_1.default.query(`SELECT games.*, avg(reviews.rating) AS average_review, count(reviews.rating) AS num_reviews FROM games LEFT JOIN reviews ON (games.game_id = reviews.entity_id AND reviews.entity_type = 'games') GROUP BY games.game_id;`)
        .then(res => res.rows)
        .then(games => games.map((element) => {
        //these are of type bigint which gets cast to string
        //converting to number types
        element.average_review = Number(element.average_review);
        element.num_reviews = Number(element.num_reviews);
        return element;
    }));
}
function findGame(game_id) {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, utils_1.checkExists)('games', 'game_id', [game_id]);
        return db_1.default
            .query(`SELECT games.*, avg(reviews.rating) AS average_review, count(reviews.rating) AS num_reviews FROM games 
          LEFT JOIN reviews ON (games.game_id = reviews.entity_id AND reviews.entity_type = 'games')
          WHERE games.game_id = $1
          GROUP BY games.game_id ;`, [game_id])
            .then((res) => res.rows[0])
            .then((game) => {
            game.num_reviews = Number(game.num_reviews);
            game.average_review = Number(game.average_review);
            return game;
        });
    });
}
function findGameReviews(game_id) {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, utils_1.checkExists)('games', 'game_id', [game_id]);
        const reviews = (yield db_1.default.query(`SELECT * FROM reviews WHERE (entity_type = 'games' AND entity_id = $1)`, [game_id])).rows;
        return reviews;
    });
}
