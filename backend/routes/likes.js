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

//Like a post
router.post("/", async (req, res) => {
    const q = "INSERT INTO likes (`liker`,`post_id`) VALUES (?)";
    const values = [
        req.body.liker,
        req.body.post_id,
    ];

    db.query(q, [values], (err, data) => {
        if (err) return res.json(err)
        return res.json("Post liked")
    });
});


//Unlike a post
router.delete("/:liker/:post_id", (req, res) => {
    const liker = req.params.liker;
    const post_id = req.params.post_id;
    db.query(`DELETE FROM likes WHERE liker = ${liker} AND post_id = ${post_id}`,
        (err, result) => {
            if (err) {
                console.log("Not found")
            }
            res.send(result)
        });
});


//get post likers
router.get("/:post_id", (req, res) => {
    const post_id = req.params.post_id;
    db.query("SELECT * FROM likes WHERE post_id = ?", post_id,
        (err, result) => {
            if (err) {
                console.log("Not found")
            }
            res.send(result)
        });
});

export default router