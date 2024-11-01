import { log } from "console";
import db from "./db";
import format from "pg-format";

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

export async function deleteEntityReviews(entity_id:any, entity_type:any) {
  let res = await db.query(`DELETE FROM reviews WHERE(entity_type= $1 AND entity_id = $2)`, [entity_type, entity_id])
  return res
}

export async function createItemArray( item_array: { id: number, qty: number }[], item_type: ('games' | 'sleeves')) {
  let colName = item_type == 'games' ? 'game_id' : 'sleeve_id'
  // get an array of order item objects including name price and qty
  //if qty > stock throw an error
  let items = []
  for (let i = 0; i < item_array.length; i++){
    const queryStr = format('SELECT * FROM %I WHERE %I = %L', item_type, colName, item_array[i].id)
    let item = await (await db.query(queryStr)).rows[0]
    if (item_array[i].qty > item.stock) {
      throw new Error('Not enough stock for this order')
    }
    items.push({name:item_type == 'games'? item.name: item.sleeve_name, price:item.price, qty:item_array[i].qty, id: item[colName] })
  }
  return items
}

export async function addItemsToOrder(sleevesArr: any, gamesArr: any, order_id: number) {
  //add games
  for (let game of gamesArr) {
    //reduce stock by qty
    await db.query("UPDATE games  SET stock = stock - $2 WHERE game_id = $1;", [
      game.id,
      game.qty,
    ]);
    //add to order items
   await db.query(
      "INSERT INTO order_items (order_id, price, qty, name) VALUES ($1,$2,$3,$4) RETURNING *;",
      [order_id, game.price, game.qty, game.name]
    );
  }
  //add sleeves
  for (let sleeve of sleevesArr) {
    console.log(sleeve)
    //reduce stock by qty
    await db.query("UPDATE sleeves  SET stock = stock - $2 WHERE sleeve_id = $1;", [
      sleeve.id,
      sleeve.qty,
    ]);
    //add to order items
     await db.query(
      "INSERT INTO order_items (order_id, price, qty, name) VALUES ($1,$2,$3,$4) RETURNING *;",
      [order_id, sleeve.price, sleeve.qty, sleeve.name]
    );
  }
}
