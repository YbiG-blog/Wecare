const express = require("express");
const Patient = require("../schemas/patient");
const Hospital = require("../schemas/hospital");

const router = new express.Router();

router.get("/hospitals", async (req, res) => {
  try {
    const allHospital = await Hospital.find();

    res.status(200).send(allHospital);
  } catch (err) {
    res.status(500).send(err);
  }
});

// router.get("/patients", async (req, res) => {
//     try {
//       const allPatient = await Patient.find();

//       res.status(200).send(allPatient);
//     } catch (err) {
//       res.status(500).send(err);
//     }
//   });
module.exports = router;
