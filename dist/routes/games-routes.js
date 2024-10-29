"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const GamesController_1 = require("../controllers/GamesController");
const gamesRouter = express_1.default.Router();
gamesRouter.route('/')
    .get(GamesController_1.getGames);
gamesRouter.route(`/:game_id`)
    .get(GamesController_1.getGame);
gamesRouter.route(`/:game_id/reviews`)
    .get(GamesController_1.getGameReviews);
exports.default = gamesRouter;
