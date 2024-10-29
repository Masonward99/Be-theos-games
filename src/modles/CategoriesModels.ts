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