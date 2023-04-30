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

//Create new user
router.post("/", async (req, res) => {
    const q = "INSERT INTO unreadtexts (`receiver_id`,`sender_id`) VALUES (?)";
    const values = [
        req.body.receiver_id,
        req.body.sender_id,
    ];
    db.query(q, [values], (err, data) => {
        if (err) return res.json(err)
        return res.json("Created Successfully")
    });
});

//get unread texts
router.get("/:receiver_id/:sender_id", (req, res) => {
    const receiver_id = req.params.receiver_id;
    const sender_id = req.params.sender_id;
    db.query(`SELECT * FROM unreadtexts WHERE receiver_id = ${receiver_id} AND sender_id = ${sender_id}`,
        (err, result) => {
            if (err) {
                console.log("Not found")
            }
            res.send(result)
        });
});


//delete unread
router.delete("/:id", (req, res) => {
    const id = req.params.id;
    const q = "DELETE FROM unreadtexts WHERE id = ?";
    db.query(q, [id], (err, data) => {
        if (err) return res.send(err);
        return res.json(data);
    });
});


export default router;