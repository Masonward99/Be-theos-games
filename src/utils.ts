import db from "./db";
import format from "pg-format";

export const checkExists = async (tableName: string, columnName: string , valueArray: any) => {
  const queryStr = format("SELECT * FROM %I WHERE %I = $1;", tableName, columnName);
  const dbOutput = await db.query(queryStr, valueArray);
  if (dbOutput.rows.length === 0) {
    return Promise.reject({ status: 404, msg: "Resource not found" });
  }
};
