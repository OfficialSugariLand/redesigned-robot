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

//Create stories
router.post("/", async (req, res) => {
    const q = "INSERT INTO stories (`user_id`,`img`) VALUES (?)";
    const values = [
        req.body.user_id,
        req.body.img
    ];
    db.query(q, [values], (err, data) => {
        if (err) return res.json(err)
        return res.json("Successful")
    });
});

//Get stories of user and friends
router.get("/:user_id", (req, res) => {

    const user_id = req.params.user_id;
    db.query(`SELECT stories.id, stories.user_id, stories.img, stories.date_time, 
    followers.follower, followers.followed FROM stories JOIN followers ON stories.user_id = followers.followed;`, user_id,
        (err, result) => {
            if (err) {
                console.log("Not found")
            }
            res.send(result)
        });
});

//delete a post
router.delete("/:id", (req, res) => {
    const id = req.params.id;
    const q = "DELETE FROM stories WHERE id = ?";
    db.query(q, [id], (err, data) => {
        if (err) return res.send(err);
        return res.json(data);
    });
});

export default router; 