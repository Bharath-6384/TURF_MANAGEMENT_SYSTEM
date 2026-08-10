import { Pool } from "pg";
import dotenv from 'dotenv'

dotenv.config()

const pool = new Pool({
    user : process.env.DATABASE_USER,
    host : process.env.DATABASE_HOST,
    database : process.env.DATABASE,
    password : process.env.DATABASE_PASSWORD,
    port : Number(process.env.DATABASE_PORT),
    ssl : false
});

export default pool