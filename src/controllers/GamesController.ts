import { Request, Response, NextFunction } from "express";
import { findGames } from "../modles/GamesModels";
export function getGames(req: Request, res: Response, next: NextFunction) {
    findGames()
        .then(games => res.status(200).send({ games }))
        .catch(next)
}