const mongoose = require("mongoose")

const NotificationCountSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    receiverId: {
        type: String,
        required: true
    },
    postId: {
        type: String,
        required: true
    }
},
    { timestamps: true }

);

module.exports = mongoose.model("NotificationCount", NotificationCountSchema);