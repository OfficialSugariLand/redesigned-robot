const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        max: 3,
        max: 20,
        unique: true
    },
    email: {
        type: String,
        required: true,
        max: 50,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        min: 6
    },
    usersId: {
        type: String,
        required: true,
        unique: true
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    profilePicture: {
        type: String,
        default: ""
    },
    coverPicture: {
        type: String,
        default: ""
    },
    followers: {
        type: Array,
        default: [],
    },
    followings: {
        type: Array,
        default: [],
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    desc: {
        type: String,
        max: 50,
    },
    gender: {
        type: String,
        required: true,
        max: 50,
    },
    sexuality: {
        type: String,
        required: true,
        max: 50,
    },
    interest: {
        type: String,
        required: true,
        max: 50,
    },
    relationship: {
        type: String,
        required: true,
        max: 50,
    },
    country: {
        type: String,
        required: true,
        max: 50,
    },
    state: {
        type: String,
        required: true,
        max: 50,
    },
    city: {
        type: String,
        required: true,
        max: 50,
    },
    dob: {
        type: String,
        required: true,
        max: 50,
    },
},
    { timestamps: true }

);

module.exports = mongoose.model("User", UserSchema);