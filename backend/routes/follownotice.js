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

//Create follow notification
router.post("/", async (req, res) => {
    const q = "INSERT INTO followednotice (`follower_id`,`followed_id`,`activities`) VALUES (?)";
    const values = [
        req.body.follower_id,
        req.body.followed_id,
        req.body.activities
    ];

    db.query(q, [values], (err, data) => {
        if (err) return res.json(err)
        return res.json("Followed successfully")
    });
});

//Get follow notification of a user
router.get("/:followed_id", (req, res) => {
    const followed_id = req.params.followed_id;
    db.query("SELECT * FROM followednotice WHERE followed_id = ?", followed_id,
        (err, result) => {
            if (err) {
                console.log("Not found")
            }
            res.send(result)
        });
});

//notification count
router.post("/count", async (req, res) => {
    const q = "INSERT INTO followcount (`follower_id`,`followed_id`,`activities`) VALUES (?)";
    const values = [
        req.body.follower_id,
        req.body.followed_id,
        req.body.activities
    ];

    db.query(q, [values], (err, data) => {
        if (err) return res.json(err)
        return res.json("Sent successfully")
    });
});

//get notification count
router.get("/count/:followed_id", (req, res) => {
    const followed_id = req.params.followed_id;
    db.query("SELECT * FROM followcount WHERE followed_id = ?", followed_id,
        (err, result) => {
            if (err) {
                console.log("Not found")
            }
            res.send(result)
        });
});

//delete a notification
router.delete("/count/:followed_id", (req, res) => {
    const followed_id = req.params.followed_id;
    const q = "DELETE FROM followcount WHERE followed_id = ?";
    db.query(q, [followed_id], (err, data) => {
        if (err) return res.send(err);
        return res.json(data);
    });
});

export default router;