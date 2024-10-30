import db from "../db";
import { checkExists } from "../utils";

export  async function addUser(username: any, password: any, email: any, dob: any, title: any, first_name: any, last_name: any, ) {
    const data = await db.query(`INSERT INTO users (username, password, email, dob, title, first_name, last_name) VALUES ($1, $2, $3, $4, $5, $6,$7) 
        RETURNING username, email, dob, title, first_name, last_name;`,
        [username, password, email, dob, title, first_name, last_name,])
    return data.rows[0]
}

export async function addAddress(username: any, address_line1:any, postcode:any, city:any) {
    const address = await db.query("INSERT INTO addresses (username, address_line1, postcode, city) VALUES ($1,$2,$3,$4) RETURNING *;",
        [username, address_line1, postcode, city])
    return address.rows[0]
}