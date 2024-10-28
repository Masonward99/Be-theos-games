import { Request, Response, NextFunction } from "express";
import { findGame, findGameReviews, findGames } from "../modles/GamesModels";
export function getGames(req: Request, res: Response, next: NextFunction) {
    findGames()
        .then(games => res.status(200).send({ games }))
        .catch(next)
}
export function getGame(req: Request, res: Response, next: NextFunction) {
    const id = req.params.game_id
    findGame(id)
        .then(game => res.status(200).send({ game }))
        .catch(next)
}

export function getGameReviews(req: Request, res: Response, next: NextFunction) {
    const id = req.params.game_id
    findGameReviews(id)
        .then(reviews=> res.status(200).send({reviews}))
        .catch(next)
}