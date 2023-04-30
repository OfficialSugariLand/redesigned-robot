const mongoose = require("mongoose")

const PhoneCodesSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    dial_code: {
        type: String,
    },
    code: {
        type: String,
    },
},
    { timestamps: true }

);

module.exports = mongoose.model("PhoneCodes", PhoneCodesSchema);