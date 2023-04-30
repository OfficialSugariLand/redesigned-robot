const mongoose = require("mongoose")

const CountriesSchema = new mongoose.Schema({
    country: {
        type: String,
    },
    states: {
        type: Array,
        default: [],
        state: {
            type: String,
        },
        cities: {
            type: Array,
            default: [],
        },
    },
},
    { timestamps: true }

);

module.exports = mongoose.model("Countries", CountriesSchema);