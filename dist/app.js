"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const api_router_1 = __importDefault(require("./routes/api-router"));
const express_session_1 = __importDefault(require("express-session"));
const passportConfig_1 = __importDefault(require("./passportConfig"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use((0, express_session_1.default)({
    secret: "dkasjdhaskjdbakwjhebd", // Ensure this is set in your .env
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // Set secure: true in production with HTTPS
}));
app.use(passportConfig_1.default.initialize());
app.use(passportConfig_1.default.session());
app.use('/api', api_router_1.default);
app.use('*', (req, res, next) => {
    res.status(404).send({ msg: "Endpoint not found!" });
});
//custom error messages
app.use((err, req, res, next) => {
    if (err.status && err.msg) {
        res.status(err.status).send({ msg: err.msg });
    }
    else {
        next(err);
    }
});
app.use((err, req, res, next) => {
    if (err.code == '22P02') {
        res.status(400).send('bad request');
    }
    else {
        console.log(err);
    }
});
exports.default = app;
