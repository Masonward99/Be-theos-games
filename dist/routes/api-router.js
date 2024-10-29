"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("../db"));
const games_routes_1 = __importDefault(require("./games-routes"));
const user_routes_1 = __importDefault(require("./user-routes"));
const apiRouter = express_1.default.Router();
apiRouter.get('/', (req, res) => {
    db_1.default.query(`SELECT * FROM games;`);
    res.send('test');
});
apiRouter.use('/games', games_routes_1.default);
apiRouter.use('/users', user_routes_1.default);
exports.default = apiRouter;
