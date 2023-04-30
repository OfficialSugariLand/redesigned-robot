import { Router } from "express";
import * as dotenv from 'dotenv';
import mysql from "mysql";
let router = Router();

dotenv.config();

const db = mysql.createConnection({
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
    database: process.env.database
})


export default router; 