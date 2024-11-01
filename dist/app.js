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
    //primary key in use
    if (err.code == "23505") {
        res.status(409).send("Key already in use");
    }
    else {
        next(err);
    }
});
app.use((err, req, res, next) => {
    //username doesnt exist
    if (err.code == "23503") {
        res.status(400).send("User does not exist");
    }
    else {
        next(err);
    }
});
app.use((err, req, res, next) => {
    //violates non-negative constraint
    if (err.code == '23514') {
        res.status(400).send('This value cannot be negative');
    }
    else {
        next(err);
    }
});
app.use((err, req, res, next) => {
    if (err.code == "22P02" || err.code == "23502") {
        res.status(400).send("bad request");
    }
    else {
        next(err);
    }
});
app.use((err, req, res, next) => {
    console.log(err);
    if (!err.message) {
        console.log(err);
        next(err);
    }
    if (err.message == 'category does not exist') {
        res.status(400).send(err.message);
    }
    if (err.message == 'Address_id does not exist') {
        res.status(404).send(err.message);
    }
});
app.use((err, req, res, next) => {
    res.status(500).send('Internal server error');
});
exports.default = app;
