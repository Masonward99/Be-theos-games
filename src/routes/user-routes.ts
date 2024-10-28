import express from "express";
import { postUser } from '../controllers/UsersController';

const userRouter = express.Router()

userRouter.route('/')
    .post(postUser)

export default userRouter