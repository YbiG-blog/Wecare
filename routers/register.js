const express = require("express");
const router = new express.Router();
const Patient = require("../schemas/patient");
const Hospital = require("../schemas/hospital");

router.get("/registerpatient", async (req, res) => {
  try {
    const data = await Patient.find();
    res.status(201).send(data);
  } catch (err) {
    res.status(400).send(err);
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

router.get("/registerhospital", async (req, res) => {
  try {
    const data = await Hospital.find();
    res.status(201).send(data);
  } catch (err) {
    res.status(400).send(err);
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