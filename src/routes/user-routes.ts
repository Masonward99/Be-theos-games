import express from "express";
import { login, postUser } from '../controllers/UsersController';
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { emailExists } from "../utils";



const userRouter = express.Router()

userRouter.route('/signup')
    .post(postUser)

userRouter.route('/login')
    .post(login)
export default userRouter