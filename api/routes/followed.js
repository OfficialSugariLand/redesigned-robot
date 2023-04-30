const router = require("express").Router();
const Followed = require("../models/Followed");
const User = require("../models/User");



//create a Followed

router.post("/", async (req, res) => {
    const newFollowed = new Followed(req.body);
    try {
        const savedFollowed = await newFollowed.save();
        res.status(200).json(savedFollowed);
    } catch (err) {
        res.status(500).json(err);
    }
});

//get user's all Followed

router.get("/:receiverId", async (req, res) => {
    try {
        const currentUser = await User.findById(req.params.receiverId);
        const userFolloweds = await Followed.find({ receiverId: currentUser._id });
        res.status(200).json(userFolloweds)
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;