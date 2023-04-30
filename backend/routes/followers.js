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

//follow a user
router.post("/", async (req, res) => {
    const q = "INSERT INTO followers (`follower`,`followed`) VALUES (?)";
    const values = [
        req.body.follower,
        req.body.followed,
    ];

    db.query(q, [values], (err, data) => {
        if (err) return res.json(err)
        return res.json("User followed")
    });
});


//unfollow a user
router.delete("/", (req, res) => {
    const values = [
        req.body.id
    ];
    const q = " DELETE FROM followers WHERE id = ?";

    db.query(q, [values], (err, data) => {
        if (err) return res.send(err);
        return res.json(data);
    });
});


//get following of a param user
router.get("/:follower", (req, res) => {
    const user_id = req.params.follower;
    db.query("SELECT * FROM followers WHERE follower = ?", user_id,
        (err, result) => {
            if (err) {
                console.log("Not found")
            }
            res.send(result)
        });
});

//Get followers
router.get("/", (req, res) => {
    const q = "SELECT * FROM followers"
    db.query(q, (err, data) => {
        if (err) return res.json(err)
        return res.json(data)
    })
})

export default router