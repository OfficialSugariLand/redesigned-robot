import { Router } from "express";
//import * as dotenv from 'dotenv';
//import mysql from "mysql";
let router = Router();
import nodemailer from 'nodemailer';
import Mailgen from "mailgen";

//https://www.youtube.com/watch?v=lBRnLXwjLw0
//https://www.npmjs.com/package/mailgen
//https://tempail.com/
const mailuser = async (req, res) => {

    const { userEmail } = req.body;
    const { Receipient } = req.body;
    const { genLink } = req.body;

    let config = {
        service: 'gmail',
        auth: {
            user: process.env.SMTP_MAIL,
            pass: process.env.SMTP_PASSWORD
        }
    }

    let transporter = nodemailer.createTransport(config);

    let MailGenerator = new Mailgen({
        theme: "default",
        product: {
            name: "Sugar iLand",
            link: 'https://sugariland.com/'
        }
    })

    let response = {
        body: {
            name: Receipient,
            intro: "A password reset was requested and a link has been generated for you which will expire in 5 minutes!",
            action: {
                instructions: 'Click the button below to reset your password:',
                button: {
                    color: '#ff9cfd', // Optional action button color
                    text: 'Reset your password',
                    link: genLink
                }
            },
            outro: "If you did not request a password reset, no further action is required on your part",
        }
    }

    let mail = MailGenerator.generate(response)

    let message = {
        from: process.env.SMTP_MAIL,
        to: userEmail,
        subject: "Password change request",
        html: mail
    }

    transporter.sendMail(message).then(() => {
        return res.status(200).json({
            msg: "you should receive an email"
        })
    }).catch(error => {
        return res.status(500).json({ error })
    })
}
/* HTTP Request */
router.post('/sendmail', mailuser)

export default router; 