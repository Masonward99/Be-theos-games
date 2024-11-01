import express from "express";
import { deleteAddress, getAddresses, getOrders, isUserAuthenticated, login, logout, postAddress, postOrder, postUser } from '../controllers/UsersController';

const userRouter = express.Router()

userRouter.route('/signup')
.post(postUser)

userRouter.route('/login')
.post(login)

userRouter.route('/logout')
.get(logout)

userRouter.use('/:username', isUserAuthenticated)

userRouter.route('/:username/addresses')
    .post(postAddress)
    .get(getAddresses)
    
userRouter.route('/:username/addresses/:review_id')
    .delete(deleteAddress)

userRouter.route(`/:username/orders`)
    .post(postOrder)
    .get(getOrders)
export default userRouter