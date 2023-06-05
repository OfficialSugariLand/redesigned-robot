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

//Create posts
router.post("/", async (req, res) => {
    const q = "INSERT INTO posts (`user_id`,`img`,`desc`) VALUES (?)";
    const values = [
        req.body.user_id,
        req.body.img,
        req.body.desc
    ];

    db.query(q, [values], (err, data) => {
        if (err) return res.json(err)
        return res.json("post sent Successfully")
    });
});

//Get posts of a user
router.get("/:user_id", (req, res) => {
    const user_id = req.params.user_id;
    db.query("SELECT * FROM posts WHERE user_id = ?", user_id,
        (err, result) => {
            if (err) {
                console.log("Not found")
            }
            res.send(result)
        });
});

//Get all posts
router.get("/", (req, res) => {
    db.query("SELECT * FROM posts",
        (err, result) => {
            if (err) {
                console.log("Not found")
            }
            res.send(result)
        });
});

//Get posts of user and friends
router.get("/friends/:user_id", (req, res) => {

    const user_id = req.params.user_id;
    db.query(`SELECT posts.id, posts.user_id, posts.img, posts.desc, posts.date_time, 
    followers.follower, followers.followed FROM posts JOIN followers ON posts.user_id = followers.followed;`, user_id,
        (err, result) => {
            if (err) {
                console.log("Not found")
            }
            res.send(result)
        });
});

//Click to open posts of a user
router.get("/userpost/:user_id/:img", (req, res) => {
    const user_id = req.params.user_id;
    const img = req.params.img;
    db.query(`SELECT * FROM posts WHERE user_id = ${user_id} AND img = "${img}"`,
        (err, result) => {
            if (err) {
                console.log("Not found")
            }
            res.send(result)
        });
});

//update a post
router.put("/:id", (req, res) => {
    const id = req.params.id;
    const q = "UPDATE posts SET `img`= ?, `desc`= ? WHERE id = ?";
    const values = [
        req.body.img,
        req.body.desc,
    ];
    db.query(q, [...values, id], (err, data) => {
        if (err) return res.send(err);
        return res.json(data);
    });
});


//delete a post
router.delete("/:id/:user_id", (req, res) => {
    const id = req.params.id;
    const user_id = req.params.user_id;
    db.query(`DELETE FROM posts WHERE id = ${id} AND user_id = ${user_id}`,
        (err, result) => {
            if (err) {
                console.log("Not found")
            }
            res.send(result)
        });
});

export default router; 