const router = require("express").Router();
const PhoneCodes = require("../models/PhoneCodes");


router.post("/", async (req, res) => {
    const phoneCode = new PhoneCodes(req.body);
    try {
        const allPhoneCodes = await phoneCode.save();
        res.status(200).json(allPhoneCodes);
    } catch (err) {
        res.status(500).json({ success: false })
    }

});


//Get countries
router.get("/", async (req, res) => {
    try {
        const allPhoneCodes = await PhoneCodes.find();
        res.send(allPhoneCodes);
    } catch (err) {
        res.status(500).json({ success: false })
    }

});
module.exports = router;
