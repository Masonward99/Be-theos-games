import express from "express";
import { login, postAddress, postUser } from '../controllers/UsersController';

const userRouter = express.Router()

userRouter.route('/signup')
    .post(postUser)

userRouter.route('/login')
    .post(login)

userRouter.route('/:username/addresses')
    .post(postAddress)
    
export default userRouter