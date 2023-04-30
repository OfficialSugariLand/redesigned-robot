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

//Sent mail
router.post("/", async (req, res) => {
    const q = "INSERT INTO sentmail (`user_id`,`secret`,`email`) VALUES (?)";
    const values = [
        req.body.user_id,
        req.body.secret,
        req.body.email
    ];

    db.query(q, [values], (err, data) => {
        if (err) return res.json(err)
        return res.json("Mail sent Successfully")
    });
});


//Get posts of a user
router.get("/:user_id/:secret", (req, res) => {
    const values = [
        req.params.user_id,
        req.params.secret
    ]

    //const user_id = req.params.user_id
    db.query("SELECT * FROM sentmail WHERE user_id = ? AND secret = ?", values,
        (err, result) => {
            if (err) {
                return res.status(500).json({
                    msg: "No record found"
                })
            }
            res.send(result[0])
        });
});

export default router; 