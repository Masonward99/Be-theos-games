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

export const emailExists = async (email: string) =>  {
  const userData = await db.query("SELECT * FROM users WHERE email = $1;", [email])
  return !(userData.rows.length == 0)
}

export const checkPassword = async (actualPassword: string, password: string) => {
  return await bcrypt.compare(password, actualPassword)
}