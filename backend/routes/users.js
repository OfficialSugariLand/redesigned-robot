import { Router } from "express";
import * as dotenv from 'dotenv';
import mysql from "mysql";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from 'uuid';
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
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const lUUID = uuidv4();
    const bigIntValue = BigInt("0x" + lUUID.replace(/-/g, ""));
    const q = "INSERT INTO users (`username`,`email`,`password`,`profilePicture`,`coverPicture`,`isAdmin`,`desc`,`dob`,`gender`,`interest`,`sexuality`,`relationship`,`country`,`state`,`city`,`user_id`,`phone_num`) VALUES (?)";
    const values = [
        req.body.username,
        req.body.email,
        hashedPassword,
        req.body.profilePicture,
        req.body.coverPicture,
        req.body.isAdmin,
        req.body.desc,
        req.body.dob,
        req.body.gender,
        req.body.interest,
        req.body.sexuality,
        req.body.relationship,
        req.body.country,
        req.body.state,
        req.body.city,
        req.body.user_id = bigIntValue,
        req.body.phone_num,
    ];
    db.query(q, [values], (err, data) => {
        if (err) return res.json(err)
        return res.json("User Created Successfully")
    });
});

//Update user
router.put("/ownuser/:user_id", async (req, res) => {
    const salt = await bcrypt.genSalt(10);
    const user_id = req.params.user_id;
    const q = "UPDATE users SET `username`= ?, `email`= ?,`desc` = ?,`dob` = ?,`gender` = ?,`interest` = ?,`sexuality` = ?, `relationship` = ?,`country` = ?, `state` = ?, `city` = ?, `phone_num` = ?  WHERE user_id = ?";
    const values = [
        req.body.username,
        req.body.email,
        req.body.desc,
        req.body.dob,
        req.body.gender,
        req.body.interest,
        req.body.sexuality,
        req.body.relationship,
        req.body.country,
        req.body.state,
        req.body.city,
        req.body.phone_num,
    ];

    db.query(q, [...values, user_id], (err, data) => {
        if (err) return res.send(err);
        return res.json("Updated successfully");
    });
});

//Update user profile picture
router.put("/ownuserpicture/:user_id", async (req, res) => {
    const user_id = req.params.user_id;
    const q = "UPDATE users SET `profilePicture` = ? WHERE user_id = ?";
    const values = [
        req.body.profilePicture
    ];
    db.query(q, [...values, user_id], (err, data) => {
        if (err) return res.send(err);
        return res.json("Updated successfully");
    });
});

//Update user's password
router.put("/ownuser/pass/:user_id", async (req, res) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const user_id = req.params.user_id;
    const q = "UPDATE users SET `password`= ? WHERE user_id = ?";
    const values = [
        hashedPassword
    ];
    db.query(q, [...values, user_id], (err, data) => {
        if (err) return res.send(err);
        return res.json("Updated successfully");
    });
});

//Update user's desc
router.put("/ownuserdesc/:user_id", async (req, res) => {
    const user_id = req.params.user_id;
    const q = "UPDATE users SET `desc` = ? WHERE user_id = ?";
    const values = [
        req.body.desc
    ];
    db.query(q, [...values, user_id], (err, data) => {
        if (err) return res.send(err);
        return res.json("Updated successfully");
    });
});

//get a user
router.get("/:user_id", (req, res) => {
    const user_id = req.params.user_id;
    db.query("SELECT * FROM users WHERE user_id = ?", user_id,
        (err, result) => {
            if (err) {
                console.log("Not found")
            }
            res.send(result)
        });
});


//Get all users
router.get("/", (req, res) => {
    const q = "SELECT * FROM users"
    db.query(q, (err, data) => {
        if (err) return res.json(err)
        return res.json(data)
    })
})

//Get all users by location
router.get("/:country/:state", (req, res) => {
    const country = req.params.country;
    const state = req.params.state;
    db.query(`SELECT * FROM users WHERE country = "${country}" AND state = "${state}"`,
        (err, data) => {
            if (err) {
                if (err) return res.send(err);
            }
            res.send(data)
        });
});


//Get all users emails
router.get("/email/values", (req, res) => {
    const q = "SELECT email FROM users"
    db.query(q, (err, data) => {
        if (err) return res.json(err)
        return res.json(data)
    })
})


//Forgot password
router.get("/forgot-password/:email", async (req, res) => {
    const email = req.params.email;
    const q = "SELECT email, password, user_id FROM users WHERE email = ?";
    db.query(q, [email], (err, data) => {
        if (err) {
            return res.json({ err: "User does not exist" })
        } else {
            return res.json(data[0])
        }
    })
});

//Update user's password
router.put("/new-password/:user_id", async (req, res) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const user_id = req.params.user_id;
    const q = "UPDATE users SET `password` = ? WHERE user_id = ?";
    const values = [
        hashedPassword,
    ];
    db.query(q, [...values, user_id], (err, data) => {
        if (err) return res.send({ err: "secret not found" });
        return res.json(data);
    });
});

export default router;