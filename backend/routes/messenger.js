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

//Chat a user
router.post("/", async (req, res) => {
    const q = "INSERT INTO messenger (`sender_id`,`receiver_id`,`text`,`img`,`conversation_id`) VALUES (?)";
    const values = [
        req.body.sender_id,
        req.body.receiver_id,
        req.body.text,
        req.body.img,
        req.body.conversation_id
    ];

    db.query(q, [values], (err, data) => {
        if (err) return res.json(err)
        return res.json("text sent Successfully")
    });
});

router.get("/:conversation_id", (req, res) => {
    const conversation_id = req.params.conversation_id;
    db.query("SELECT * FROM messenger WHERE conversation_id = ?", conversation_id,
        (err, result) => {
            if (err) {
                console.log("Not found")
            }
            res.send(result)
        });
});

export default router;