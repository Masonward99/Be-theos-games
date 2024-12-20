import { Request, Response, NextFunction } from "express";
import {
  addSleeve,
  addSleeveReview,
  findSleeve,
  findSleeveReviews,
  findSleeves,
  removeSleeve,
} from "../models/SleevesModels";

export async function getSleeves(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    let sleeves = await findSleeves();
    res.status(200).send({ sleeves });
  } catch (err) {
    next(err);
  }
}

export async function postSleeve(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { sleeve_name, description, price, height, width, stock, pack_size } =
    req.body;
  try {
    let sleeve = await addSleeve(
      sleeve_name,
      description,
      price,
      stock,
      height,
      width,
      pack_size
    );
    res.status(201).send({ sleeve });
  } catch (err) {
    next(err);
  }
}

export async function getSleeve(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { sleeve_id } = req.params;
  try {
    let sleeve = await findSleeve(sleeve_id);
    res.status(200).send({ sleeve });
  } catch (err) {
    next(err);
  }
}

export async function deleteSleeve(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { sleeve_id } = req.params;
  try {
    await removeSleeve(sleeve_id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

export async function getSleeveReviews(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { sleeve_id } = req.params;
  try {
    let reviews = await findSleeveReviews(sleeve_id);
    res.status(200).send({ reviews });
  } catch (err) {
    next(err);
  }
}

export async function postSleeveReview(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { sleeve_id } = req.params;
  const { rating, author, review_body, created_at, review_title } = req.body;
  try {
    let review = await addSleeveReview(
      sleeve_id,
      rating,
      author,
      review_body,
      created_at,
      review_title
    );
    res.status(201).send({ review });
  } catch (err) {
    console.log(err);
    next(err);
  }
}
