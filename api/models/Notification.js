const mongoose = require("mongoose")

const NotificationSchema = new mongoose.Schema({
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
    },
    username: {
        type: String,
        required: true
    },
    userActivities: {
        type: String
    }
},
    { timestamps: true }

);

module.exports = mongoose.model("Notification", NotificationSchema);