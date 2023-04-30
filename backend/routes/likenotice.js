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

//Create like notification
router.post("/", async (req, res) => {
    const q = "INSERT INTO likesnotice (`sender_id`,`receiver_id`,`post_id`,`activities`) VALUES (?)";
    const values = [
        req.body.sender_id,
        req.body.receiver_id,
        req.body.post_id,
        req.body.activities
    ];
    db.query(q, [values], (err, data) => {
        if (err) return res.json(err)
        return res.json("Liked successfully")
    });
});

//Get like notification of a user
router.get("/:receiver_id", (req, res) => {
    const receiver_id = req.params.receiver_id;
    db.query("SELECT * FROM likesnotice WHERE receiver_id = ?", receiver_id,
        (err, result) => {
            if (err) {
                console.log("Not found")
            }
            res.send(result)
        });
});

//delete a notification
router.delete("/:id", (req, res) => {
    const id = req.params.id;
    const q = "DELETE FROM likesnotice WHERE id = ?";
    db.query(q, [id], (err, data) => {
        if (err) return res.send(err);
        return res.json(data);
    });
});

//notification count
router.post("/count", async (req, res) => {
    const q = "INSERT INTO likecount (`sender_id`,`receiver_id`,`post_id`,`activities`) VALUES (?)";
    const values = [
        req.body.sender_id,
        req.body.receiver_id,
        req.body.post_id,
        req.body.activities
    ];
    db.query(q, [values], (err, data) => {
        if (err) return res.json(err)
        return res.json("Sent successfully")
    });
});

//get notification count
router.get("/count/:receiver_id", (req, res) => {
    const receiver_id = req.params.receiver_id;
    db.query("SELECT * FROM likecount WHERE receiver_id = ?", receiver_id,
        (err, result) => {
            if (err) {
                console.log("Not found")
            }
            res.send(result)
        });
});

export default router;