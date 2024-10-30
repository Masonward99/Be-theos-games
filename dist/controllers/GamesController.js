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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGames = getGames;
exports.getGame = getGame;
exports.getGameReviews = getGameReviews;
exports.postGame = postGame;
const GamesModels_1 = require("../modles/GamesModels");
function getGames(req, res, next) {
    (0, GamesModels_1.findGames)()
        .then(games => res.status(200).send({ games }))
        .catch(next);
}
function getGame(req, res, next) {
    const id = req.params.game_id;
    (0, GamesModels_1.findGame)(id)
        .then(game => res.status(200).send({ game }))
        .catch(next);
}
function getGameReviews(req, res, next) {
    const id = req.params.game_id;
    (0, GamesModels_1.findGameReviews)(id)
        .then(reviews => res.status(200).send({ reviews }))
        .catch(next);
}
function postGame(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const gameData = req.body;
        try {
            let game = yield (0, GamesModels_1.addGame)(gameData);
            res.status(201).send({ game });
        }
        catch (err) {
            next(err);
        }
    });
}
