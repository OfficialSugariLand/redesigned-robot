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


//Chat notification
router.post("/", async (req, res) => {
    const q = "INSERT INTO textnotification (`sender_id`,`receiver_id`, `text`) VALUES (?)";
    const values = [
        req.body.sender_id,
        req.body.receiver_id,
        req.body.text,
    ];

    db.query(q, [values], (err, data) => {
        if (err) return res.json(err)
        return res.json("Sent Successfully")
    });
});

//Get chat notification
router.get("/:receiver_id", (req, res) => {
    const receiver_id = req.params.receiver_id;
    db.query(`SELECT * FROM textnotification WHERE receiver_id = ${receiver_id}`,
        (err, result) => {
            if (err) {
                console.log("Not found")
            }
            res.send(result)
        });
});

//notification count
router.post("/count", async (req, res) => {
    const q = "INSERT INTO textcount (`sender_id`,`receiver_id`) VALUES (?)";
    const values = [
        req.body.sender_id,
        req.body.receiver_id,
    ];
    db.query(q, [values], (err, data) => {
        if (err) return res.json(err)
        return res.json("Sent successfully")
    });
});

//get notification count
router.get("/count/:receiver_id", (req, res) => {
    const receiver_id = req.params.receiver_id;
    db.query("SELECT * FROM textcount WHERE receiver_id = ?", receiver_id,
        (err, result) => {
            if (err) {
                console.log("Not found")
            }
            res.send(result)
        });
});

//delete a notification
router.delete("/count/:receiver_id", (req, res) => {
    const receiver_id = req.params.receiver_id;
    const q = "DELETE FROM textcount WHERE receiver_id = ?";
    db.query(q, [receiver_id], (err, data) => {
        if (err) return res.send(err);
        return res.json(data);
    });
});

export default router;