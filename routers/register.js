const express = require("express");
const router = new express.Router();
const Patient = require("../schemas/patient");
const Hospital = require("../schemas/hospital");
const { verify } = require("jsonwebtoken");

router.get("/patient/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const data = await Patient.findById(id);
    res.status(200).send(data);
  } catch (err) {
    res.status(400).send(err);
  }
});
// update patient
router.patch("/patient/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const data = await Patient.findOneAndUpdate(id,{
      $set: req.body
    });
      res.status(200).send("Account Updated");
  } catch (err) {
    res.status(400).send(err);
  }
});
// delete patient
router.delete("/patient/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const data = await Patient.findByIdAndDelete(id);
    res.status(200).json("Account deleted");
  } catch (err) {
    console.log(err);
    return res.status(400).json(err);
  }
});
router.post("/registerpatient", async (req, res) => {
  const otp = Math.floor(Math.floor(100000 + Math.random() * 900000));
  try {
    const { name, email, mobileNum, password, gender, state, district } =
      await req.body;
    const patientExist = await Patient.findOne({ email });

    if (patientExist) {
      return res.status(200).send({ msg: "already exists." });
    }

    const patient_create = new Patient({
      name,
      email,
      mobileNum,
      password,
      gender,
      state,
      district,
    });

    const save = await patient_create.save();

    res.status(201).send(save);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.get("/hospital/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const data = await Hospital.findById(id);
    res.status(200).send(data);
  } catch (err) {
    res.status(400).send(err);
  }
});
// update hospital
router.patch("/hospital/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const data = await Hospital.findOneAndUpdate(id,{
      $set: req.body
    });
      res.status(200).send("Account Updated");
  } catch (err) {
    res.status(400).send(err);
  }
});
// delete hospital
router.delete("/hospital/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const data = await Hospital.findByIdAndDelete(id);
    res.status(200).json("Account deleted");
  } catch (err) {
    console.log(err);
    return res.status(400).json(err);
  }
});
router.post("/registerhospital", async (req, res) => {
  // const otp = Math.floor(Math.floor(100000 + Math.random() * 900000));
  try {
    const { name, email, mobileNum, password, state, district, hospitalType } =
      await req.body;
    const hospitalExist = await Hospital.findOne({ email });

    if (hospitalExist) {
      return res.status(200).send({ msg: "already exists." });
    }

    const hospital_create = new Hospital({
      name,
      email,
      mobileNum,
      password,
      state,
      district,
      hospitalType,
    });

    const save = await hospital_create.save();

    res.status(201).send(save);
  } catch (err) {
    res.status(400).send(err);
  }
});

module.exports = router;