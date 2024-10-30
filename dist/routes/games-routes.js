"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const GamesController_1 = require("../controllers/GamesController");
const gamesRouter = express_1.default.Router();
gamesRouter.route('/')
    .get(GamesController_1.getGames)
    .post(GamesController_1.postGame);
gamesRouter.route(`/:game_id`)
    .get(GamesController_1.getGame)
    .delete(GamesController_1.deleteGame)
    .patch(GamesController_1.patchGame);
gamesRouter.route(`/:game_id/reviews`)
    .get(GamesController_1.getGameReviews);
gamesRouter.route(`/:game_id/categories`)
    .post(GamesController_1.postCategoriesToGame);
gamesRouter.route(`/:game_id/categories/:category_name`)
    .delete(GamesController_1.deleteCateogryFromGames);
exports.default = gamesRouter;
