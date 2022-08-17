const express = require("express");
const Hospital = require("../schemas/hospital");
const Bads = require("../schemas/bads")
const router = new express.Router();

router.get("/total/bads", async (req, res) => {
    try {
      const availableBads = await Bads.find({
        booking : false,
      }).countDocuments();
      
      console.log( availableBads );
      res.status(200).json({ availableBads });
      return;
    } catch (err) {
      res.sendStatus(500);
      return;
    }
  });

  module.exports = router;
