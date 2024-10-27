import express from "express"
import { getGame, getGames } from "../controllers/GamesController";
const gamesRouter = express.Router();

gamesRouter.route('/')
    .get(getGames)

gamesRouter.route(`/:game_id`)
    .get(getGame)

export default gamesRouter