import db from "../db";
import { addItemsToOrder, checkExists, createItemArray } from "../utils";

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

export async function removeAddress(id: any, username:any) {
    const address = await db.query('DELETE FROM addresses WHERE (username = $1 AND address_id = $2) RETURNING *;',
        [username, id])
    if (address.rows.length == 0) {
        throw new Error('Address_id does not exist')
    }
    return address.rows[0]
}

export async function findAddresses(username: any) {
    const addresses = await db.query("SELECT * FROM addresses WHERE username = $1", [username])
    return addresses.rows
}

export async function addOrder(username: string, games: any, sleeves: any, address_id: any, date: any) {
    const res = await db.query(`INSERT INTO orders 
        (username, address_id, date)
        VALUES ($1, $2, $3)
        RETURNING *`,
        [username, address_id, date])
    let order_id = res.rows[0].order_id
    let gamesArray:any = []
    games ? gamesArray = await createItemArray(games, 'games') : null
    let sleevesArray:any = []
    sleeves ? sleevesArray = await createItemArray(sleeves, 'sleeves') : null
    await addItemsToOrder(sleevesArray, gamesArray, order_id)
    let order = await db.query(
        `SELECT orders.*, sum(order_items.qty * order_items.price) total_price,
        ARRAY_AGG(order_items.name) AS items
        FROM ORDERS
        left join order_items
        ON orders.order_id = order_items.order_id
        WHERE orders.order_id = $1
        GROUP BY orders.order_id;
        `,
      [order_id]
    );
    return order.rows[0]
}

export async function findOrders(username: any) {
    let orders =
      await db.query(`SELECT orders.*, sum(order_items.qty * order_items.price) total_price,
        sum(order_items.price) AS num_items
        FROM ORDERS
        left join order_items
        ON orders.order_id = order_items.order_id
        WHERE orders.username =  $1
        GROUP BY orders.order_id;`, [username]);
    return orders.rows
}