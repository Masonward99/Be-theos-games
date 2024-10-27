import express from "express"
import { getGames } from "../controllers/GamesController";
const gamesRouter = express.Router();

gamesRouter.route('/')
    .get(getGames)

export default gamesRouter