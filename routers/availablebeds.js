const express = require("express");
const Beds = require("../models/bed");
const router = new express.Router();


router.get("/beds", async (req, res) => {
  try {
    const findBeds = await Beds.find();
    return res.status(200).send(findBeds);
  } catch (err) {
   return  res.status(400).send(`err ${err}`);
  } });

router.get("/beds/:type", async ({ params }, res) => {
  try {
    const type = params.type;
    if (type == "General") {
      const findBeds = await Beds.find().sort({ "generalType.availbility": -1 });
     return res.status(200).json(findBeds);
    } else if (type == "Special") {
     const findBeds = await Beds.find().sort({ "specialType.availbility": -1 });
    return  res.status(200).json(findBeds);
    }
    return res.status(401).send("This category not exist");
  } catch (err) {
    return res.status(500).send(`err ${err}`);
  }
});

module.exports = router;
