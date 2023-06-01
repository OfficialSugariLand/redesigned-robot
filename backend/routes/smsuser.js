import { Router } from "express";
import mysql from "mysql";
let router = Router();
import * as dotenv from 'dotenv';
// Define "require"
import { createRequire } from "module";
const require = createRequire(import.meta.url);
dotenv.config();
const Nexmo = require('nexmo');

// Init Nexmo
const nexmo = new Nexmo({
    apiKey: process.env.API_KEY,
    apiSecret: process.env.SMS_SECRET_KEY
}, { debug: true });
/* const nexmo = new Nexmo({
    apiKey: 'b7106dca',
    apiSecret: '41alwTyVRTEA1qv7'
}, { debug: true }); */

const db = mysql.createConnection({
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
    database: process.env.database
})

router.post("/", async (req, res) => {
    const q = "INSERT INTO smsuser (`phone_num`,`otp`,`user_id`) VALUES (?)";
    const values = [
        req.body.phone_num,
        req.body.otp,
        req.body.user_id,
    ];

    db.query(q, [values], (err, data) => {
        if (err) return res.json(err)
        return res.json({ msg: "Otp Sent Successfully" })
    });
});

router.get("/:user_id/:phone_num", (req, res) => {
    const user_id = req.params.user_id;
    const phone_num = req.params.phone_num
    db.query(`SELECT * FROM smsuser WHERE user_id = ${user_id} AND phone_num = ${phone_num}`,
        (err, result) => {
            if (err) {
                return res.status(500).json({
                    msg: "No record found"
                })
            }
            res.send(result)
        });
});

//Delete OTP user after verification
router.put("/:user_id/:phone_num", async (req, res) => {
    const user_id = req.params.user_id;
    const q = "UPDATE smsuser SET `user_id` = ? WHERE user_id = ?";
    const values = [
        req.body.user_id
    ];
    db.query(q, [...values, user_id], (err, data) => {
        if (err) return res.send(err);
        return res.json("Updated successfully");
    });
});

//send sms to user
router.post('/smsusers', async (req, res) => {
    //https://www.youtube.com/watch?v=980wnspXLe0
    //https://dev.to/vonagedev/how-to-send-and-receive-sms-messages-with-node-js-and-express-4g46
    const from = "Sugar iLand";
    const number = req.body.number;
    const text = req.body.text;

    await nexmo.message.sendSms(from, number, text, {
        type: "unicode"
    }, (err, responseData) => {
        if (err) {
            console.log(err);
        } else {
            console.dir(responseData);
        }
    })
})

export default router;