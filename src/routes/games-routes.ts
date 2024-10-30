import express from "express"
import { deleteGame, getGame, getGameReviews, getGames, postCategoriesToGame, postGame } from "../controllers/GamesController";
const gamesRouter = express.Router();

gamesRouter.route('/')
    .get(getGames)
    .post(postGame)

gamesRouter.route(`/:game_id`)
    .get(getGame)
    .delete(deleteGame)

gamesRouter.route(`/:game_id/reviews`)
    .get(getGameReviews)

gamesRouter.route(`/:game_id/categories`)
    .post(postCategoriesToGame)

export default gamesRouter