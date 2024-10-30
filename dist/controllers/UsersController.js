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
exports.postAddress = postAddress;
const UsersModels_1 = require("../modles/UsersModels");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const passportConfig_1 = __importDefault(require("../passportConfig"));
function postUser(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        let { username, password, email, dob, title, first_name, last_name } = req.body;
        try {
            if (!password)
                return res.status(400).send('password is required');
            password = yield bcryptjs_1.default.hash(password, 10);
            const user = yield (0, UsersModels_1.addUser)(username, password, email, dob, title, first_name, last_name);
            return res.status(201).send({ user });
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
            //user data without password field
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
function postAddress(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        let { username } = req.params;
        if (!req.isAuthenticated()) {
            console.log('not logged in');
            return res.status(401).send('Need to login to use this endpoint');
        }
        const authUser = req.user;
        if (!(username == authUser.username)) {
            console.log('wrong user');
            return res.status(403).send('Access denied');
        }
        // if (!username == req.user.username)
        //   let { postcode, address_line1, city } = req.body
        //   try {
        //   }
        //   catch (err) { next(err) }
        res.status(200).send();
    });
}
