import express from "express";
import { login, postUser } from '../controllers/UsersController';




const userRouter = express.Router()

userRouter.route('/signup')
    .post(postUser)

userRouter.route('/login')
    .post(login)
export default userRouter