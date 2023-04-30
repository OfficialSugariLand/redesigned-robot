const router = require("express").Router();
const Notification = require("../models/Notification");
const User = require("../models/User");



//create a notification

router.post("/", async (req, res) => {
    const newNotification = new Notification(req.body);
    try {
        const savedNotification = await newNotification.save();
        res.status(200).json(savedNotification);
    } catch (err) {
        res.status(500).json(err);
    }
});

//get user's all notification

router.get("/:receiverId", async (req, res) => {
    try {
        const currentUser = await User.findById(req.params.receiverId);
        const userNotifications = await Notification.find({ receiverId: currentUser._id });
        res.status(200).json(userNotifications)
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;