const express = require("express");
const Hospital = require("../models/hospital");
const Bed = require("../models/bed");
const { result } = require("lodash");
const router = new express.Router();

router.get("/hospitals", async (req, res) => {
  try {
    const allHospital = await Hospital.find();
    return res.status(200).json(allHospital);
  } catch (err) {
    return res.status(500).jsonn(`err ${err}`);
  }
});
router.get("/hospitals/:city", async ({ params }, res) => {
  try {
    const { city } = params;
    const allHospital = await Hospital.find( { city: city }, { password: 0 });
    if (allHospital.length === 0) {
      return res.status(404).send("No bed available in this area");
    }
    return res.status(200).json(allHospital);
  } catch (err) {
    return res.status(500).send(`err ${err}`);
  }
});
router.get("/hospitalsbypin/:pincode", async ({ params }, res) => {
  try {
    const { pincode } = params;
    const allHospital = await Hospital.find( { pincode: pincode }, { password: 0 }  );
    if (allHospital.length === 0) {
      return res.status(404).send("No bed available in this area");
    }
    return res.status(200).json(allHospital);
  } catch (err) {
    return res.status(500).send(`err ${err}`);
  }
});
router.get("/data-district", async (req, res) => {
  try {
   const findCity = await Hospital.aggregate([
    {$unwind: "$city"}, {$group :  { _id :"$city"} }, {$project : { _id : 1 }},
   ]);
   let dataArray  = [];
   for (const e in findCity) {
    let val = await Bed.aggregate([
      {$match :{ city : findCity[e]._id }},
      { $group: {
        bedCount : { $sum : { $add: ["$generalType.availbility","$specialType.availbility"]}},
        hospitalsCount : { $sum : 1 } ,
        _id:0 },} ]);
  dataArray.push({"city" : findCity[e]._id, "availableBeds" : val})
   };
   return res.status(200).json(dataArray); 
  } catch (e) {
    console.log(`error : ${e.message}`);
   return res.status(500).send(`err ${e}`);
  }
});

module.exports = router;
