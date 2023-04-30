import express from "express";
//import mysql from "mysql";
import cors from "cors";
import userRoute from "./routes/users.js";
import authRoute from "./routes/auth.js";
import followedRoute from "./routes/followers.js";
import messengerRoute from "./routes/messenger.js";
import conversationRoute from "./routes/conversations.js";
import postsRoute from "./routes/posts.js";
import likesRoute from "./routes/likes.js";
import storiesRoute from "./routes/stories.js";
import followNoticeRoute from "./routes/follownotice.js";
import likeNoticeRoute from "./routes/likenotice.js";
import passwordResetRoute from "./routes/passwordreset.js";
import mailerRoute from "./routes/mailer.js";
import sentmailRoute from "./routes/sentmail.js";
import unreadtextsRoute from "./routes/unreadtexts.js";
import path from "path";
import multer from "multer";

const app = express()

/* const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "sugarpass0489$",
    database: "sugariland"
}) */

app.use(express.json())
app.use(cors())
const __dirname = path.resolve();
app.use("/images", express.static(path.join(__dirname, "public/images")));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/images");
    },
    filename: (req, file, cb) => {
        cb(null, req.body.name);
    },
});

const upload = multer({ storage });
app.post("/backend/upload", upload.single("file"), (req, res) => {
    try {
        return res.status(200).json("File uploaded successfully.");

    } catch (err) {
        console.log(err);
    }
});

app.get("/", (req, res) => {
    res.json("Welcome to Sugar iLand")
})

app.use("/backend/users", userRoute);
app.use("/backend/auth", authRoute);
app.use("/backend/followers", followedRoute);
app.use("/backend/messenger", messengerRoute);
app.use("/backend/conversations", conversationRoute);
app.use("/backend/posts", postsRoute);
app.use("/backend/likes", likesRoute);
app.use("/backend/stories", storiesRoute);
app.use("/backend/follownotice", followNoticeRoute);
app.use("/backend/likenotice", likeNoticeRoute);
app.use("/backend/passwordreset", passwordResetRoute);
app.use("/backend/mailer", mailerRoute);
app.use("/backend/sentmail", sentmailRoute);
app.use("/backend/unreadtexts", unreadtextsRoute);

app.listen(8800, () => {
    console.log("Connected to Server!")
});