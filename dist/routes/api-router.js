"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("../db"));
const apiRouter = express_1.default.Router();
apiRouter.get('/', (req, res) => {
    db_1.default.query(`SELECT * FROM games;`);
    res.send('test');
});
exports.default = apiRouter;
