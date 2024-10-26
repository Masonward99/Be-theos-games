import express, { Request, Response, Router } from 'express';
import db from '../db';
const apiRouter:Router = express.Router()

apiRouter.get('/', (req:Request, res:Response) => {
    db.query(`SELECT * FROM games;`)
    res.send('test')
}
)
export default apiRouter