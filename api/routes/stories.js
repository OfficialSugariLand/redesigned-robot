const router = require("express").Router();
const Story = require("../models/Story");
const User = require("../models/User");

//create a story
router.post("/", async (req, res) => {
    const newStories = new Story(req.body);
    try {
        const savedStories = await newStories.save();
        res.status(200).json(savedStories);
    } catch (err) {
        res.status(500).json(err);
    }
});

//delete a story
router.delete("/:id", async (req, res) => {
    try {
        //const allStories = await Story.find();
        const stories = await Story.deleteMany();
        res.status(200).json(stories)
    } catch (err) {
        res.status(500).json(err);
    }
});


/* //delete a story
router.delete("/:id", async (req, res) => {
    try {
        const story = await Story.findById(req.params.id);
        if (story.userId === req.body.userId) {
            await story.deleteOne();
            res.status(200).json("the story has been deleted")
        } else {
            res.status(403).json("you can only delete your story");
        }
    } catch (err) {
        res.status(500).json(err);
    }
}); */

//like / dislike a story
router.put("/:id/like", async (req, res) => {
    try {
        const story = await Story.findById(req.params.id);
        if (!story.likes.includes(req.body.userId)) {
            await story.updateOne({ $push: { likes: req.body.userId } });
            res.status(200).json("the story has been liked by you")
        } else {
            await story.updateOne({ $pull: { likes: req.body.userId } });
            res.status(200).json("The story has been disliked");
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

//get timeline posts
router.get("/timeline/:userId", async (req, res) => {
    try {
        const currentUser = await User.findById(req.params.userId);
        const userStories = await Story.find({ userId: currentUser._id });
        const friendStories = await Promise.all(
            currentUser.followings.map((friendId) => {
                return Story.find({ userId: friendId });
            })
        );
        res.status(200).json(userStories.concat(...friendStories))
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;