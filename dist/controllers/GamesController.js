"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGames = getGames;
exports.getGame = getGame;
exports.getGameReviews = getGameReviews;
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
