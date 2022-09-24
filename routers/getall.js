const express = require("express");
const Hospital = require("../models/hospital");
const Bed = require("../models/bed");
const jwtDecode = require("jwt-decode");
const verify = require("../middleware/auth");
const router = new express.Router();

router.get("/hospitals", async (req, res) => {
  try {
    const allHospital = await Hospital.find();
    res.status(200).send(allHospital);
  } catch (err) {
    res.status(500).send(`err ${err}`);
  }
});
router.get("/hospitals/:city", async ({ params }, res) => {
  try {
    const citywise = params.city;
    const allHospital = await Hospital.find(
      { city: citywise },
      {
        password: 0,
      }
    );
    if (allHospital.length === 0) {
      res.status(404).send("No bed available in this area");
      return;
    }
    res.status(200).send(allHospital);
  } catch (err) {
    res.status(500).send(`err ${err}`);
  }
});
router.get("/hospitalsbypin/:pincode", async ({ params }, res) => {
  try {
    const pinwise = params.pincode;
    const allHospital = await Hospital.find(
      { pincode: pinwise },
      {
        password: 0,
      }
    );
    if (allHospital.length === 0) {
      res.status(404).send("No bed available in this area");
      return;
    }
    res.status(200).send(allHospital);
  } catch (err) {
    res.status(500).send(`err ${err}`);
  }
});
router.get("/data-district", async (req, res) => {
  try {
    let bedsj = 0, numhj = 0,
      bedsa = 0, numha = 0,
      bedsk = 0, numhk = 0;
    const findbedJ = await Bed.find(
      { city: "jaipur" },
      { _id: 1, generalType: 1, specialType: 1, HospitsalId: 1 }
    );
    const findbedk = await Bed.find(
      { city: "kota" },
      { _id: 1, generalType: 1, specialType: 1, HospitsalId: 1 }
    );
    const findbeda = await Bed.find(
      { city: "ajmer" },
      { _id: 1, generalType: 1, specialType: 1, HospitsalId: 1 }
    );
findbedJ.forEach(e => {
        bedsj +=
          e.generalType.availbility +
          e.specialType.availbility;
        numhj += 1;
});
findbeda.forEach(e => {
  bedsa +=
    e.generalType.availbility +
    e.specialType.availbility;
  numha += 1;
});
findbedk.forEach(e => {
  bedsk +=
    e.generalType.availbility +
    e.specialType.availbility;
  numhk += 1;
});
    const result = { bedsj, bedsk, bedsa, numhj, numhk, numha };
    res.status(200).json(result);
  } catch (error) {
    res.status(500).send(`err ${error}`);
  }
});

module.exports = router;
