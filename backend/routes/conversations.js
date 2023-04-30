import { Router } from "express";
import * as dotenv from 'dotenv';
import mysql from "mysql";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from 'uuid';
let router = Router();

dotenv.config();

const db = mysql.createConnection({
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
    database: process.env.database
})

//Create new conversation
router.post("/", async (req, res) => {
    const q = "INSERT INTO conversations (`conversation_id`,`user_id`,`user_two`,`last_text`) VALUES (?)";
    const values = [
        req.body.conversation_id,
        req.body.user_id,
        req.body.user_two,
        req.body.last_text
    ];
    db.query(q, [values], (err, data) => {
        if (err) return res.json(err)
        return res.json("Conversation Created Successfully")
    });
});

//Get conversations
router.get("/:user_id", (req, res) => {
    const user_id = req.params.user_id;
    db.query("SELECT * FROM conversations WHERE user_id = ?", user_id,
        (err, result) => {
            if (err) {
                console.log("Not found")
            }
            res.send(result)
        });
});

router.put("/:conversation_id", (req, res) => {
    const conversation_id = req.params.conversation_id;
    const date = new Date();
    const q = "UPDATE conversations SET `last_text`= ?, `date_time`= ? WHERE conversation_id = ?";

    const values = [
        req.body.last_text,
        req.body.date_time = date,
    ];

    db.query(q, [...values, conversation_id], (err, data) => {
        if (err) return res.send(err);
        return res.json(data);
    });
});

export default router;