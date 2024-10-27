import {  Pool } from 'pg';
import dotenv from 'dotenv';

const ENV :string = process.env.NODE_ENV || 'development';

dotenv.config({
  path: `${__dirname}/../.env.${ENV}`,
});
if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
  throw new Error('PGDATABASE not set or DATABASE_URL not set');
}
const config =
  ENV  === "production"
    ? {
        connectionString: process.env.DATABASE_URL,
        max: 2,
      }
    : {
       database: process.env.DATABASE_URL
    };
console.log(ENV)

const db:Pool = new Pool(config)
export default db
    