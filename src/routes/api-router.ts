import express, { Request, Response, Router } from 'express';
import db from '../db';
import { getGames } from '../controllers/GamesController';
import gamesRouter from './games-routes';
const apiRouter:Router = express.Router()

apiRouter.get('/', (req:Request, res:Response) => {
    db.query(`SELECT * FROM games;`)
    res.send('test')
}
)

apiRouter.use('/games', gamesRouter)
export default apiRouter