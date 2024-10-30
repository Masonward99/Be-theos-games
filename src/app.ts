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
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  //primary key in use
  if (err.code == "23505") {
    res.status(409).send("Key already in use");
  } else {
    next(err)
  }
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  //violates non-negative constraint
  if (err.code == '23514') {
    res.status(400).send('This value cannot be negative')
  } else {
    next(err)
  }
})

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err.code == "22P02" || err.code == "23502") {
    res.status(400).send("bad request");
  } else {
    next(err)
  }
})
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (!err.message) {
    console.log(err)
     next(err)
  }
  if (err.message == 'category does not exist') {
    res.status(400).send(err.message)
  }
 })

export default app