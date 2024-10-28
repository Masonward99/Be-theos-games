import express, { Request, Response, Router } from 'express';
import db from '../db';
import gamesRouter from './games-routes';
import userRouter from './user-routes';
const apiRouter:Router = express.Router()

apiRouter.get('/', (req:Request, res:Response) => {
    db.query(`SELECT * FROM games;`)
    res.send('test')
    }
)

apiRouter.use('/games', gamesRouter)
apiRouter.use('/users', userRouter)

export default apiRouter