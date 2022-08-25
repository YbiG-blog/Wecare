const express = require("express");
const Hospital = require("../schemas/hospital");
const Beds = require("../schemas/bad");
const router = new express.Router();

router.get("/hospitals", async (req, res) => {
  try {
    const allHospital = await Hospital.find();
    let result = [],bedObj=[]; 
    for (let i = 0; i < allHospital.length; i++) {
      let findBed = await Beds.find({ hospitalId : allHospital[i]._id });
      let Hos = allHospital[i];
      let bedres=findBed[0];
      // var sumOfBed = bedres.generalType.availbility + bedres.specialType.availbility;
      // console.log(sumOfBed);
      result.push({Hos, bedres});
      bedObj.push(bedres);
    }
    for (let i = 0; i < bedObj.length; i++) {
     console.log(bedObj[1].generalType.availbility);
    }
    res.status(200).send(result);
  } catch (err) {
    res.status(500).send(`err ${err}`);
  }
});

module.exports = router;
