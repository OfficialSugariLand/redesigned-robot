const router = require("express").Router();
const Countries = require("../models/Countries");

//Get countries
router.get("/", async (req, res) => {
    try {
        const allCountries = await Countries.find();
        res.send(allCountries);
    } catch (err) {
        res.status(500).json({ success: false })
    }

});
module.exports = router;
