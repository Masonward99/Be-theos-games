import express, {Express, Request, Response, NextFunction } from 'express';
import cors from 'cors'
import apiRouter from './routes/api-router';

const app:Express  = express();

app.use(cors())
app.use(express.json())

app.use('/api', apiRouter)


app.use('*', ( req: Request, res : Response, next : NextFunction) => {
  res.status(404).send({ msg: "Endpoint not found!" });
})


export default app