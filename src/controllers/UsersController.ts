import { NextFunction, Request, Response } from "express";
import { addUser } from "../modles/UsersModels";
import { emailExists } from "../utils";
import bcrypt from 'bcryptjs'

export async function postUser(req: Request, res:Response, next:NextFunction) {
    let { username, password, email, dob, title, first_name, last_name } = req.body
    password = await bcrypt.hash(password, 10)
    console.log(password)
    try {
        const user = await addUser(username, password, email, dob, title, first_name, last_name)
        return res.status(201).send(user)
    } catch(error) {
        next(error)
    }
}