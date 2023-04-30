const router = require("express").Router();
const NotificationCount = require("../models/NotificationCount");
const User = require("../models/User");

//notification count
router.post("/", async (req, res) => {
    const notificationCount = new NotificationCount(req.body);
    try {
        const savedNotificationCount = await notificationCount.save();
        res.status(200).json(savedNotificationCount);
    } catch (err) {
        res.status(500).json(err);
    }
});


//get user's all notification count
router.get("/:receiverId", async (req, res) => {
    try {
        const currentUser = await User.findById(req.params.receiverId);
        const userNotificationsCount = await NotificationCount.find({ receiverId: currentUser._id });
        res.status(200).json(userNotificationsCount)
    } catch (err) {
        res.status(500).json(err);
    }
});


//delete activities count
router.delete("/:receiverId", async (req, res) => {
    try {
        const currentUser = await User.findById(req.params.receiverId);
        const userNotificationsCount = await NotificationCount.deleteMany({ receiverId: currentUser._id });
        res.status(200).json(userNotificationsCount)
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;