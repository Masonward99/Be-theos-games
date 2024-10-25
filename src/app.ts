import express from 'express';
import cors from 'cors'
import apiRouter from './routes/api-router';

const app = express();

app.use(cors())
app.use(express.json())

app.use('/api', apiRouter)


app.use('*', ( req, res, next) => {
  res.status(404).send({ msg: "Endpoint not found!" });
})


export default app