import db from "../db";

export async function findCategories() {
  const categories = (
    await db.query(
      `SELECT categories.*, count(games_categories.game_id) AS num_games  
      FROM categories LEFT JOIN games_categories 
      ON categories.category_name = games_categories.category_name 
      group BY (categories.category_name);`
    )
  ).rows;
  return categories
}

export async function addCategory(name : string , description: string) {
  const category = await db.query(`INSERT INTO categories (category_name, description) VALUES ($1, $2) RETURNING *;`, [name, description])
  return category.rows[0]
}
