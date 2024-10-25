import { Pool } from 'pg';
import dotenv from 'dotenv';
const ENV = process.env.NODE_ENV || 'development';


dotenv.config({
  path: `${__dirname}/../.env.${ENV}`,
});
if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
  throw new Error('PGDATABASE not set or DATABASE_URL not set');
}
const config =
  ENV === "production"
    ? {
        connectionString: process.env.DATABASE_URL,
        max: 2,
      }
    : {
       database: process.env.DATABASE_URL
    };


const db = new Pool(config)
export default db
    