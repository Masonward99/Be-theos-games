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
