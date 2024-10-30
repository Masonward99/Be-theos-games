import db from "../db";

export async function findSleeves() {
  let sleeves = await db.query(`SELECT sleeves.*, avg(reviews.rating) AS average_review, count(reviews.rating) AS num_reviews
     FROM sleeves
     LEFT JOIN reviews ON (sleeves.sleeve_id = reviews.entity_id AND reviews.entity_type = 'sleeves')
     GROUP BY sleeves.sleeve_id;`)
  return sleeves.rows
}