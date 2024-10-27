"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGames = getGames;
const GamesModels_1 = require("../modles/GamesModels");
function getGames(req, res, next) {
    (0, GamesModels_1.findGames)()
        .then(games => res.status(200).send({ games }))
        .catch(next);
}
