import { Router } from "express";
import * as dotenv from 'dotenv';
import mysql from "mysql";
import { v4 as uuidv4 } from 'uuid';
let router = Router();

dotenv.config();

const db = mysql.createConnection({
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
    database: process.env.database
})

//Forgot password
router.post("/", async (req, res) => {
    const lUUID = uuidv4();
    const bigIntValue = BigInt("0x" + lUUID.replace(/-/g, ""));
    const q = "INSERT INTO passwordreset (`user_id`,`secret`,`email`) VALUES (?)";
    const values = [
        req.body.user_id,
        req.body.secret = bigIntValue,
        req.body.email,
    ];
    db.query(q, [values], (err, data) => {
        if (err) {
            return res.json({ err: "Not sent" })
        } else {
            return res.json("Password reset sent Successful")
        }
    })
});

//get parameter user_id && secret
router.get("/reset-password/link/:user_id/:secret", (req, res) => {
    const values = [
        req.params.user_id,
        req.params.secret,
    ]
    db.query("SELECT * FROM passwordreset WHERE user_id = ? AND secret = ?", values,
        (err, data) => {
            if (err) {
                if (err) return res.send(err);
            }
            res.send(data[0])
        });
});

//get all secrets
router.get("/reset-password/:email", (req, res) => {
    const values = [
        req.params.email,
    ]
    db.query("SELECT * FROM passwordreset WHERE email = ?", values,
        (err, data) => {
            if (err) {
                if (err) return res.send(err);
            }
            res.send(data[0])
        });
});

//Delete password reset link
router.delete("/delete-request/:user_id/:secret", (req, res) => {
    const values = [
        req.body.id
    ];
    const user_id = req.params.user_id;
    const secret = req.params.secret;
    const q = "DELETE FROM passwordreset WHERE id = ?";
    db.query(q, [values, user_id, secret], (err, data) => {
        if (err) return res.send(err);
        return res.json(data);
    });
});

export default router;