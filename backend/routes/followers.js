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
router.delete("/:followed", (req, res) => {
    const followed = req.params.followed;
    const q = "DELETE FROM followers WHERE followed = ?";
    db.query(q, [followed], (err, data) => {
        if (err) return res.send(err);
        return res.json(data);
    });
});

//check if my user is following me
router.get("/ownfollowing/:follower/:followed", (req, res) => {
    const follower = req.params.follower;
    const followed = req.params.followed;
    db.query(`SELECT * FROM followers WHERE follower = ${follower} AND followed = ${followed}`,
        (err, result) => {
            if (err) {
                console.log("Not following")
            }
            res.send(result)
        });
});

//get following of a param user
router.get("/:follower", (req, res) => {
    const user_id = req.params.follower;
    db.query("SELECT * FROM followers WHERE follower = ?", user_id,
        (err, result) => {
            if (err) {
                console.log("None found")
            }
            res.send(result)
        });
});

//Get followed friends
router.get("/:follower/:followed", (req, res) => {
    const follower = req.params.follower;
    const followed = req.params.followed;
    db.query(`SELECT * FROM followers WHERE follower = ${follower} AND followed = ${followed}`,
        (err, result) => {
            if (err) {
                console.log("None found")
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
    });
});

export default router