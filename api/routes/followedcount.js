const router = require("express").Router();
const FollowedCount = require("../models/FollowedCount");
const User = require("../models/User");

//notification count
router.post("/", async (req, res) => {
    const newFollowedCount = new FollowedCount(req.body);
    try {
        const savedFollowedCount = await newFollowedCount.save();
        res.status(200).json(savedFollowedCount);
    } catch (err) {
        res.status(500).json(err);
    }
});


//get user's all notification count
router.get("/:receiverId", async (req, res) => {
    try {
        const currentUser = await User.findById(req.params.receiverId);
        const userFollowedCount = await FollowedCount.find({ receiverId: currentUser._id });
        res.status(200).json(userFollowedCount)
    } catch (err) {
        res.status(500).json(err);
    }
});


//delete activities count
router.delete("/:receiverId", async (req, res) => {
    try {
        const currentUser = await User.findById(req.params.receiverId);
        const userFollowedCount = await FollowedCount.deleteMany({ receiverId: currentUser._id });
        res.status(200).json(userFollowedCount)
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;