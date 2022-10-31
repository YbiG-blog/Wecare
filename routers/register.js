const express = require("express");
const router = new express.Router();
const Hospital = require("../models/hospital");
const Beds = require("../models/bed");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");

// get post post req
router.post("/hospitalbyid", async ({ body }, res) => {
  try {
    const Id = body.Id;
    const dataHos = await Hospital.findById(Id);
    const bedData = await Beds.findOne(
      { hospitalId: Id },
      {
        // projection
        _id: 0,
        generalType: 1,
        specialType: 1,
        otherFacilities:1,
      }
    );
    console.log(bedData.generalType.availbility);
    res.status(200).send({ dataHos, bedData });
  } catch (err) {
    res.status(400).send(err);
  }
});
router.get("/hospital/:id", async ({ params }, res) => {
  try {
    const Id = params.id;
    const dataHos = await Hospital.findById(Id);
    const bedData = await Beds.findOne(
      { hospitalId: Id },
      {
        // projection
        _id: 0,
        generalType: 1,
        specialType: 1,
      }
    );
    res.status(200).send({ dataHos, bedData });
  } catch (err) {
    res.status(400).send(err);
  }
});
// update hospital
router.patch("/hospital/:id", async ({ body, params }, res) => {
  try {
    const Id = params.id;
   const t = await Hospital.findOneAndUpdate(
      {
        _id: Id,
      },
      {
        $set: body,
      }
    );
    res.status(200).send("Account Updated");
  } catch (err) {
    res.status(400).send(err);
  }
});
// delete hospital
router.delete("/hospital/:id", async ({ params }, res) => {
  try {
    const Id = params.id;
    const data = await Hospital.findByIdAndDelete(Id);
    res.status(200).json("Account deleted");
  } catch (err) {
    console.log(err);
    return res.status(400).json(err);
  }
});
router.post("/registerhospital", async (req, res) => {
  try {
    const {
      name,
      email,
      mobileNum,
      password,
      address,
      state,
      city,
      pincode,
      hospitalType,
    } = await req.body;
    const hospitalExist = await Hospital.findOne({ email });

    if (hospitalExist) {
      return res.status(200).send({ msg: "already exists." });
    }
    // const cookie_token = await  Hospital.generateAuthToken();
    const hospital_create = new Hospital({
      name,
      email,
      mobileNum,
      password,
      address,
      state,
      city,
      pincode,
      hospitalType,
    });
    // password encryption------------
    hospital_create.password = await bcrypt.hash(
      hospital_create.password,
      saltRounds
    );
    const save = await hospital_create.save();
    // token
    const pay_load = { _id: hospital_create._id };
    const token = jwt.sign(pay_load, process.env.TOKEN_SECRET_KEY);
    res.status(201).send({ save, token });
  } catch (err) {
    res.status(400).send(`error ${err}`);
  }
});

module.exports = router;
