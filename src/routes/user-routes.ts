import express from "express";
import { deleteAddress, login, logout, postAddress, postUser } from '../controllers/UsersController';

const userRouter = express.Router()

userRouter.route('/signup')
    .post(postUser)

userRouter.route('/login')
    .post(login)

userRouter.route('/logout')
    .get(logout)

userRouter.route('/:username/addresses')
    .post(postAddress)
    
userRouter.route('/:username/addresses/:review_id')
    .delete(deleteAddress)

export default userRouter