const mongoose = require("mongoose")

const FollowedCountSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    receiverId: {
        type: String,
        required: true
    }
},
    { timestamps: true }

);

module.exports = mongoose.model("FollowedCount", FollowedCountSchema);