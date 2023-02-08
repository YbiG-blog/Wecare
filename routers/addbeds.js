const express = require("express");
const router = new express.Router();
const Bed = require("../models/bed");
const jwtDecode = require("jwt-decode");
const Hospital = require("../models/hospital");
const verify = require("../middleware/auth");

router.patch("/addBed", verify, async ({ body }, res) => {
  try {
    const { cookie_token,  generalType, specialType, otherFacilities } = body;
    const decode = jwtDecode( cookie_token );
    const { _id, city } = decode;
    const findBed = await Bed.findOneAndUpdate( { hospitalId : _id },{
      $set : { generalType, specialType } });

 if(!findBed){ new Bed({ hospitalId: _id, generalType, specialType, otherFacilities, city : city }).save();}
    return res.status(201).json({ msg: "Bed added/updated successfully" });
  } catch (err) {
    console.log(`err : ${err.message}`);
   return res.status(500).send(err);
  }
});

router.post("/seeBeds", async ({ body }, res) => {
  try {
    const { hospitalId } = body;
    const bedData = await Bed.findOne({ hospitalId: hospitalId }).populate(
      { path : "hospitalId" } );
       if(!bedData)  return res.status(401).send("No Beds");
        return res.status(200).send(bedData);
  } catch (err) {
   return res.status(400).send(err);
  }
});
// "hospitalId":"632e0674d1b20113a204368e"

module.exports = router;
