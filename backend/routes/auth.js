import * as dotenv from 'dotenv';
import mysql from "mysql";
import bcrypt from "bcrypt";
import { Router } from "express";
let router = Router();

//Database connection
dotenv.config();

const db = mysql.createConnection({
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
    database: process.env.database
})

//LOGIN
router.post("/login", async (req, res) => {
    const phone_num = req.body.phone_num;
    db.query("SELECT * FROM users WHERE phone_num = ? ", [phone_num], function (error, results, fields) {
        if (error) throw error;
        else {
            if (results.length > 0) {
                bcrypt.compare(req.body.password, results[0].password, function (err, result) {
                    if (result) {
                        return res.send(results[0]);
                    }
                    else {
                        return res.status(400).send({ message: "Invalid Password" });
                    }
                });
            } else {
                return res.status(400).send({ message: "Invalid phone number" });
            }
        }
    });
});

export default router