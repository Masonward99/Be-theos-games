import { NextFunction, Response, Request } from "express";
import { addCategory, findCategories } from "../models/CategoriesModels";

export async function getCategories(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const categories = await findCategories();
    return res.status(200).send({ categories });
  } catch (err) {
    next(err);
  }
}

export async function postCategory(
  req: Request,
  res: Response,
  next: NextFunction
) {
  let { category_name, description } = req.body;
  try {
    const category = await addCategory(category_name, description);
    return res.status(201).send({ category });
  } catch (err) {
    next(err);
  }
}
