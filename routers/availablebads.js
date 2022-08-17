const express = require("express");
const Hospital = require("../schemas/hospital");
const Bads = require("../schemas/bads")
const router = new express.Router();

router.get("/totalnum/bads", async (req, res) => {
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
router.get("/bads/:id", async (req, res) => {
    try {
        const id = req.params.id;
      const findBad = await Bads.findById(id); 
    //   console.log( findBad );
      res.status(200).send(findBad);
      return;
    } catch (err) {
    res.status(400).send(`err ${err}`);
      return;
    }
});

router.get("/bads", async (req, res) => {
    try {
      const findBads = await Bads.find(); 
    //   console.log( findBads );
      res.status(200).send(findBads);
      return;
    } catch (err) {
    res.status(400).send(`err ${err}`);
      return;
    }
});

  module.exports = router;
