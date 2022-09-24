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
router.get("/datadistrict", async (req, res) => {
  try {
  // let bedsj = 0,
  //   numhj = 0;
  // const findbedJ = await Hospital.find({ city: "jaipur" }).populate("HospitalId");
  // for (let i = 0; i < findbedJ.length; i++) {
  //   let id = findbedJ[i]._id;
  //   const availableBeds = await Bed.find({ HospitalId: id });
  //   bedsj +=
  //     availableBeds[i].generalType.availbility +
  //     availableBeds[i].specialType.availbility;
  //   numhj += 1;
  // }
  // let bedsk = 0,
  //   numhk = 0;
  // const findbedk = await Hospital.find({ city: "kota" }).populate("HospitalId");
  // for (let i = 0; i < findbedk.length; i++) {
  //   let id = findbedk[i]._id;
  //   const availableBeds = await Bed.find({ HospitalId: id });
  //   bedsk +=
  //     availableBeds[i].generalType.availbility +
  //     availableBeds[i].specialType.availbility;
  //   numhk += 1;
  // }
  // let bedsa = 0,
  //   numha = 0;
  // const findbeda = await Hospital.find({ city: "ajmer" }).populate("HospitalId");
  // for (let i = 0; i < findbeda.length; i++) {
  //   let id = findbeda[i]._id;
  //   const availableBeds = await Bed.find({ HospitalId: id });
  //   bedsa +=
  //     availableBeds[i].generalType.availbility +
  //     availableBeds[i].specialType.availbility;
  //   numha += 1;
  // }
  // const result = { bedsj, bedsk, bedsa, numhj, numhk, numha };
  res.status(200).send('jnj');
} catch (error) {
  res.status(501).send(`err ${error}`)
}
});
router.put("/pichart", verify, async ({ body }, res) => {
  try {
    const token = body.cookie_token;
    const decode = jwtDecode(token);
    const { _id } = decode;

    let total = 0,
      general = 0,
      special = 0;

    const availableBeds = await Bed.find({ hospitalId: _id });
    console.log(availableBeds);
    total =
      availableBeds.generalType.availbility +
      availableBeds.specialType.availbility;
    general = availableBeds.generalType.availbility;
    special = availableBeds.specialType.availbility;

    const result = { total, general, special };
    res.status(200).send(result);
  } catch (err) {
    res.status(400).send(`err ${err}`);
  }
});

module.exports = router;
