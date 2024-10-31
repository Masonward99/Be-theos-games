import db from "../db";

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