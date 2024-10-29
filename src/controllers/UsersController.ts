import { NextFunction, Request, Response } from "express";
import { addUser } from "../modles/UsersModels";
import bcrypt from 'bcryptjs'
import passport from '../passportConfig'

export async function postUser(req: Request, res:Response, next:NextFunction) {
    let { username, password, email, dob, title, first_name, last_name } = req.body
    password = await bcrypt.hash(password, 10)
    try {
        const user = await addUser(username, password, email, dob, title, first_name, last_name)
        return res.status(201).send(user)
    } catch(error) {
        next(error)
    }
}

export  function login(req: Request, res: Response, next: NextFunction) {
    passport.authenticate("local", (err: any, user: any, info: any) => {
      if (err) return res.status(500).send({ msg: "Server error" });
        if (!user)return res.status(401).send({ msg: 'Invalid username or password' })
        req.logIn(user, (err) => {
          if (err) return res.status(500).send({ msg: "Server error" });
        res.status(200).send({user});
      });
    })(req, res, next);
}