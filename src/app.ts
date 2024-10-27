import express, {Express, Request, Response, NextFunction, Errback, ErrorRequestHandler } from 'express';
import cors from 'cors'
import apiRouter from './routes/api-router';

const app:Express  = express();

app.use(cors())
app.use(express.json())

app.use('/api', apiRouter)


app.use('*', ( req: Request, res : Response, next : NextFunction) => {
  res.status(404).send({ msg: "Endpoint not found!" });
})
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err.code == '22P02') {
    res.status(400).send('bad request')
  } else {
    console.log(err.code)
  }
})


export default app