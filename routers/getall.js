const express = require("express");
const Hospital = require("../schemas/hospital");
const Beds = require("../schemas/bad");
const router = new express.Router();

router.get("/hospitals", async (req, res) => {
  try {
    const allHospital = await Hospital.find();
    let result = [];
    
    for (let i = 0; i < allHospital.length; i++) {
      let findBed = await Beds.find({ hospitalId : allHospital[i]._id});
      console.log(findBed);
      let Hos = allHospital[i];
      result.push({Hos, findBed});
    }
    res.status(200).send(result);
  } catch (err) {
    res.status(500).send(`err ${err}`);
  }
});

module.exports = router;
