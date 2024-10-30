import { Request, Response, NextFunction } from "express";
import { addCategoriesToGame, addGame, findGame, findGameReviews, findGames, removeCategoryFromGame, removeGame } from "../modles/GamesModels";
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

export async function deleteGame(req:Request, res:Response, next:NextFunction) {
    const { game_id } = req.params
    try {
        let game = await removeGame(game_id)
        res.status(204).send()
    }
    catch (err){
        next(err)
    }
}

export async function postCategoriesToGame(req:Request, res:Response, next:NextFunction) {
    // accepts an body with a key of categories that is an array of category names
    //adds all categories to the game
    // sends the game with all its categories if succesful
    const { categories } = req.body
    const { game_id } = req.params
    try {
        let game = await addCategoriesToGame(categories, game_id)
        res.status(201).send({game})
    }
    catch (err) {
        next(err)
    }
}

export async function deleteCateogryFromGames(req:Request, res:Response, next:NextFunction) {
    const { game_id, category_name } = req.params
    console.log(game_id, category_name)
    try {
         await removeCategoryFromGame(game_id, category_name)
        res.status(204).send()
    }
    catch (err) {
        next(err)
    }
}