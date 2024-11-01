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
exports.logout = logout;
exports.deleteAddress = deleteAddress;
exports.getAddresses = getAddresses;
exports.isUserAuthenticated = isUserAuthenticated;
const UsersModels_1 = require("../models/UsersModels");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const passportConfig_1 = __importDefault(require("../passportConfig"));
function postUser(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        let { username, password, email, dob, title, first_name, last_name } = req.body;
        try {
            if (!password)
                return res.status(400).send("password is required");
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
            return res.status(401).send({ msg: "Invalid username or password" });
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
                email: user.email,
            };
            res.status(200).send({ userData });
        });
    })(req, res, next);
}
function postAddress(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        let { username } = req.params;
        let { postcode, address_line1, city } = req.body;
        try {
            let address = yield (0, UsersModels_1.addAddress)(username, address_line1, postcode, city);
            res.status(201).send({ address });
        }
        catch (err) {
            next(err);
        }
    });
}
function logout(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        req.logout((err) => {
            if (err) {
                return next(err);
            }
            res.status(200).send("Logout succesful");
        });
    });
}
function deleteAddress(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        let { username, review_id } = req.params;
        try {
            yield (0, UsersModels_1.removeAddress)(review_id, username);
            res.status(204).send();
        }
        catch (err) {
            next(err);
        }
    });
}
function getAddresses(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        let { username } = req.params;
        try {
            let addresses = yield (0, UsersModels_1.findAddresses)(username);
            res.status(200).send({ addresses });
        }
        catch (err) {
            next(err);
        }
    });
}
function isUserAuthenticated(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        //midleware function to check that user is authenticated and is the same as the user in request
        let { username } = req.params;
        if (!req.isAuthenticated()) {
            return res.status(401).send("Need to login to use this endpoint");
        }
        const authUser = req.user;
        if (!(username == authUser.username)) {
            return res.status(403).send("Access denied");
        }
        next();
    });
}
