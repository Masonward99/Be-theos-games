import { Request, Response, NextFunction } from "express";
import { findSleeves } from "../modles/SleevesModels";
export async function getSleeves(req: Request, res: Response, next: NextFunction) {
  try {
    let sleeves = await findSleeves()
    res.status(200).send({sleeves})
  }
  catch (err) {
    console.log(err)
    next(err)
  }
}