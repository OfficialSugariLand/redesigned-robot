const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
const storiesRoute = require("./routes/stories");
const notificationRoute = require("./routes/notification");
const notificationCountRoute = require("./routes/notificationCounts");
const followedRoute = require("./routes/followed");
const followedcountRoute = require("./routes/followedcount");
const ConversationRoute = require("./routes/conversations");
const MessageRoute = require("./routes/messages");
const CountriesRoute = require("./routes/countries");
const PhoneCodesRoute = require("./routes/phonecodes");
const User = require("./models/User");
const multer = require("multer");
const path = require("path");
const cors = require("cors");


dotenv.config();

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true }, () => {
    console.log("Connected to MongoDB")
});

app.use(cors())
app.use("/images", express.static(path.join(__dirname, "public/images")));

//middleware

app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/images");
    },
    filename: (req, file, cb) => {
        cb(null, req.body.name);
    },
});

const upload = multer({ storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
    try {
        return res.status(200).json("File uploaded successfully.");

    } catch (err) {
        console.log(err);
    }
});

//Update user
const put = multer({ storage });
app.post("/api/put", put.single("file"), (req, res) => {
    try {
        return res.status(200).json("File uploaded successfully.");

    } catch (err) {
        console.log(err);
    }
});


app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);
app.use("/api/stories", storiesRoute);
app.use("/api/conversations", ConversationRoute);
app.use("/api/messages", MessageRoute);
app.use("/api/notification", notificationRoute);
app.use("/api/notificationCounts", notificationCountRoute);
app.use("/api/followed", followedRoute);
app.use("/api/followedcount", followedcountRoute);
app.use("/api/countries", CountriesRoute);
app.use("/api/phonecodes", PhoneCodesRoute);

app.listen(5000, () => {
    console.log("Backend server is running!")
})