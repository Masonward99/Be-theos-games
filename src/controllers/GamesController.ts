import { Request, Response, NextFunction } from "express";
import { addGame, findGame, findGameReviews, findGames } from "../modles/GamesModels";
import { error } from "console";
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

export async function postGame(req: Request, res: Response, next: NextFunction) {
    const gameData: Game = req.body
    try {
        let game = await addGame(gameData)
        res.status(201).send({game})
    }
    catch (err) {
        next(err)
    }
}