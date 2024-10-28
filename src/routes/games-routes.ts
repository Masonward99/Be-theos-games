import express from "express"
import { getGame, getGameReviews, getGames } from "../controllers/GamesController";
const gamesRouter = express.Router();

gamesRouter.route('/')
    .get(getGames)

gamesRouter.route(`/:game_id`)
    .get(getGame)
gamesRouter.route(`/:game_id/reviews`)
    .get(getGameReviews)
export default gamesRouter