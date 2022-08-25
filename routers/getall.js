const express = require("express");
const Hospital = require("../schemas/hospital");
const Beds = require("../schemas/bad");
const _ = require('lodash');
const router = new express.Router();

router.get("/hospitals", async (req, res) => {
  try {
    const allHospital = await Hospital.find();
    res.status(200).send(allHospital);
  } catch (err) {
    res.status(500).send(`err ${err}`);
  }
});
router.get("/hospitals/:city", async (req, res) => {
  try {
    let citywise = _.lowerCase(req.params.city);
    const allHospital = await Hospital.find({ city : citywise });
   
    res.status(200).send(allHospital);
  } catch (err) {
    res.status(500).send(`err ${err}`);
  }
});
router.get("/datadistrict", async(req,res)=>{
  // const availableBeds = await Beds.find({

  // }).countDocuments()
  let s = 0;
  const availableBeds = await Beds.find();
  for (let i = 0; i < availableBeds.length; i++) {
    let d= availableBeds[i].generalType.availbility+availableBeds[i].specialType.availbility;
    s+=d;
  }
  console.log(s);
  res.status(200).send(`${s}`);
})

module.exports = router;
