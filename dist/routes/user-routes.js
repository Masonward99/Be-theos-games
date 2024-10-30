"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const UsersController_1 = require("../controllers/UsersController");
const userRouter = express_1.default.Router();
userRouter.route('/signup')
    .post(UsersController_1.postUser);
userRouter.route('/login')
    .post(UsersController_1.login);
userRouter.route('/:username/addresses')
    .post(UsersController_1.postAddress);
exports.default = userRouter;
