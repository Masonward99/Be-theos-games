import db from "../db";
import { checkExists, deleteEntityReviews } from "../utils";

export async function findSleeves() {
  let sleeves = await db.query(`SELECT sleeves.*, avg(reviews.rating) AS average_review, count(reviews.rating) AS num_reviews
     FROM sleeves
     LEFT JOIN reviews ON (sleeves.sleeve_id = reviews.entity_id AND reviews.entity_type = 'sleeves')
     GROUP BY sleeves.sleeve_id;`)
  return sleeves.rows
}

export async function addSleeve(name:string, description:string, price:any, stock:any, height:any, width:any, pack_size:any) {
  let sleeve = await db.query(`INSERT INTO sleeves 
    (sleeve_name, description, price, stock, height, width, pack_size)
    VALUES ($1,$2,$3,$4,$5,$6,$7)
    RETURNING *;`,
  [name, description, price, stock, height, width, pack_size])
  return sleeve.rows[0]
}

export async function findSleeve(id: any) {
  await checkExists('sleeves', 'sleeve_id', [id])
  let sleeve = await db.query(
    `SELECT sleeves.*, avg(reviews.rating) AS average_review, count(reviews.rating) AS num_reviews
     FROM sleeves
     LEFT JOIN reviews ON (sleeves.sleeve_id = reviews.entity_id AND reviews.entity_type = 'sleeves')
     WHERE sleeves.sleeve_id = $1
     GROUP BY sleeves.sleeve_id
     ;`,
    [id]
  );
  return sleeve.rows[0]
}

export async function removeSleeve(id: any) {
  await checkExists('sleeves', 'sleeve_id', [id])
  let sleeve = await db.query('DELETE FROM sleeves WHERE sleeve_id = $1 RETURNING *', [id])
  await deleteEntityReviews(id, 'sleeves')
  return sleeve.rows[0]
}

export async function findSleeveReviews(id: any) {
  await checkExists('sleeves', 'sleeve_id', [id])
  let reviews = await db.query(`SELECT * FROM reviews WHERE (entity_type = 'sleeves' AND entity_id = $1);`, [id])
  return reviews.rows
}

export async function addSleeveReview(id: any, rating: any, author: any, body: any, created_at: any, review_title: any) {
  await checkExists('sleeves', 'sleeve_id', [id])
  let review = await db.query(`INSERT INTO reviews 
    (entity_type, entity_id, rating, author, review_body, review_title, created_at)
    VALUES('sleeves', $1,$2,$3,$4,$5, $6)
    RETURNING *;`,
    [id, rating, author, body, review_title, created_at])
  return review.rows[0]
  
}