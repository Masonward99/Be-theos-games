import db from "./db";
import format from "pg-format";
import bcrypt from 'bcryptjs'

export const checkExists = async (tableName: string, columnName: string , valueArray: any) => {
  const queryStr = format("SELECT * FROM %I WHERE %I = $1;", tableName, columnName);
  const dbOutput = await db.query(queryStr, valueArray);
  if (dbOutput.rows.length === 0) {
    return Promise.reject({ status: 404, msg: "Resource not found" });
  }
};

export const checkCategoryInUse = async (categoryName:string) => {
  const category = await db.query('Select * FROM categories WHERE category_name = $1', [categoryName])
  return !(category.rows.length == 0)
}

export async function checkAllCategoriesExist(categories: string[]) {
  for (const categoryName of categories) {
    const exist = await checkCategoryInUse(categoryName);
    if (!exist) {
      throw new Error("category does not exist");
    }
  }
}

export async function addAllCategoriesToGames(categories: string[], game_id: number) {
  for (let index in categories) {
     await db.query(
       `INSERT INTO games_categories (game_id, category_name) VALUES ($1, $2);`,
       [game_id, categories[index]]
     );
   }
  let game =
    await db.query(`SELECT games.*, avg(reviews.rating) AS average_review, ARRAY_AGG(DISTINCT games_categories.category_name) AS categories, 
          count(DISTINCT reviews.review_id) AS num_reviews FROM games 
          LEFT JOIN reviews ON (games.game_id = reviews.entity_id AND reviews.entity_type = 'games')
          LEFT JOIN games_categories ON (games.game_id = games_categories.game_id)
          WHERE games.game_id = $1
          GROUP BY games.game_id ;`, [game_id]);
  return game
}