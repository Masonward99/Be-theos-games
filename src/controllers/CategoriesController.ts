import { NextFunction, Response, Request } from "express";
import { findCategories } from "../modles/CategoriesModels";

export async function getCategories(req:Request, res:Response, next:NextFunction) {
  const categories = await findCategories()
  return res.status(200).send({ categories })
}