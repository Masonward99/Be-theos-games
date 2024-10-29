import express, {Express, Request, Response, NextFunction, Errback, ErrorRequestHandler } from 'express';
import cors from 'cors'
import apiRouter from './routes/api-router';
import session from 'express-session'
import passport from './passportConfig'

const app:Express  = express();

app.use(cors())
app.use(express.json())

app.use(
  session({
    secret: "dkasjdhaskjdbakwjhebd", // Ensure this is set in your .env
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // Set secure: true in production with HTTPS
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use('/api', apiRouter)


app.use('*', ( req: Request, res : Response, next : NextFunction) => {
  res.status(404).send({ msg: "Endpoint not found!" });
})

//custom error messages
app.use((err:any, req: Request, res:Response, next:NextFunction) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err.code == '22P02') {
    res.status(400).send('bad request')
  } else {
    console.log(err)
  }
})


export default app