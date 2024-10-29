"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postUser = postUser;
exports.login = login;
const UsersModels_1 = require("../modles/UsersModels");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const passportConfig_1 = __importDefault(require("../passportConfig"));
function postUser(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        let { username, password, email, dob, title, first_name, last_name } = req.body;
        password = yield bcryptjs_1.default.hash(password, 10);
        try {
            const user = yield (0, UsersModels_1.addUser)(username, password, email, dob, title, first_name, last_name);
            return res.status(201).send(user);
        }
        catch (error) {
            next(error);
        }
    });
}
function login(req, res, next) {
    passportConfig_1.default.authenticate("local", (err, user, info) => {
        if (err)
            return res.status(500).send({ msg: "Server error" });
        if (!user)
            return res.status(401).send({ msg: 'Invalid username or password' });
        req.logIn(user, (err) => {
            if (err)
                return res.status(500).send({ msg: "Server error" });
            const userData = {
                username: user.username,
                title: user.title,
                first_name: user.first_name,
                last_name: user.last_name,
                dob: user.dob,
                email: user.email
            };
            res.status(200).send({ userData });
        });
    })(req, res, next);
}
