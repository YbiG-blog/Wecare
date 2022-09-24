const express = require("express");
const router = new express.Router();
const Bed = require("../models/bed");
const jwtDecode = require("jwt-decode");
const verify = require("../middleware/auth");

router.put("/addbed", verify, async ({ body }, res) => {
  try {
    const token = body.cookie_token;
    const decode = jwtDecode(token);
    const { _id } = decode;
    const { generalType, specialType, otherFacilities } = await body;
    let beds_creat = new Bed({
      hospitalId: _id,
      generalType,
      specialType,
      otherFacilities,
    });
    await beds_creat.save();
    let msg = "bed add successfully";
    await res.status(201).send({ msg });
  } catch (err) {
    res.status(500).send(err);
  }
});

router.put("/seebeds", async ({ body }, res) => {
  try {
    const hospitalId = body.hospitalId;
    const bedData = await Bed.find({ hospitalId: hospitalId }).populate(
      "hospitalId",
      "name email mobileNum state city pincode hospitalType"
    );
    res.status(200).send(bedData);
  } catch (err) {
    res.status(400).send(err);
  }
});

module.exports = router;
