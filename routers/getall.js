const express = require("express");
const Hospital = require("../models/hospital");
const Bed = require("../models/bed");
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
    const allHospital = await Hospital.find({ city: city.toLowerCase() }, { password: 0, __v : 0 });

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
    const allHospital = await Hospital.find({ pincode: pincode }, { password: 0 });
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
    const dataArray = await Bed.aggregate([
      { $unwind: "$city" },
      {
        $group: {
          _id: "$city",
          bedCount: { $sum: { $add: ["$generalType.availbility", "$specialType.availbility"] } },
          hospitalsCount: { $sum: 1 }  } },
          {$sort : { _id : 1 }} ]);
    return res.status(200).json(dataArray);
  } catch (e) {
    console.log(`error : ${e.message}`);
    return res.status(500).send(`err ${e}`);
  }
});

module.exports = router;
