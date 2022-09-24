const express = require("express");
const Hospital = require("../models/hospital");
const Beds = require("../models/bed");
const jwtDecode = require("jwt-decode");
const verify = require("../middleware/auth");
const router = new express.Router();

// get Bed by post
router.post("/bedbyid", async ({ body }, res) => {
  try {
    const Id = body.Id;
    const findBed = await Beds.findById(Id);
    const relatedHospital = await Hospital.findById(findBed.hospitalId);
    const HospitalName = relatedHospital.name;

    const data = { findBed, HospitalName };
    res.status(200).send(data);
    return;
  } catch (err) {
    res.status(400).send(`err ${err}`);
    return;
  }
});

router.get("/bed/:id", async ({ params }, res) => {
  try {
    const Id = params.id;
    const findBed = await Beds.findById(Id);
    if (!findBed) {
      res.status(404).send("data not found");
      return;
    }
    const relatedHospital = await Hospital.findById(findBed.hospitalId);
    const HospitalName = relatedHospital.name;

    const data = { findBed, HospitalName };
    res.status(200).send(data);
    return;
  } catch (err) {
    res.status(400).send(`err ${err}`);
    return;
  }
});

// update bed
router.patch("/bed/:id", verify, async ({ body, params }, res) => {
  try {
    const Id = params.id;
    const token = body.cookie_token;
    const decode = jwtDecode(token);
    const data = await Beds.findOneAndUpdate(
      {
        _id: Id,
      },
      {
        $set: body,
      }
    );
    res.status(200).send(`Bed data Updated ${data}`);
  } catch (err) {
    res.status(400).send(`err ${err}`);
  }
});

router.delete("/bed/:id", verify, async ({ body, params }, res) => {
  try {
    const token = body.cookie_token;
    const decode = jwtDecode(token);
    const Id = params.id;
    const findBed = await Beds.findById(Id);
    if (!findBed) {
      res.status(404).send("data not found");
      return;
    }
    await Beds.findByIdAndDelete({
      _id: Id,
    });
    res.status(200).send("Bed data deleted");
  } catch (err) {
    res.status(400).send(err);
  }
});

router.get("/beds", async (req, res) => {
  try {
    const findBeds = await Beds.find();
    res.status(200).send(findBeds);
    return;
  } catch (err) {
    res.status(400).send(`err ${err}`);
    return;
  }
});

router.get("/beds/:type", async ({ params }, res) => {
  try {
    const type = params.type;
    if (type == "General") {
      const findBeds = await Beds.find().sort({
        "generalType.availbility": -1,
      });
      res.status(200).send(findBeds);
    } else if (type == "Special") {
      findBeds = await Beds.find().sort({ "specialType.availbility": -1 });
      res.status(200).send(findBeds);
    }
    return;
  } catch (err) {
    res.status(400).send(`err ${err}`);
    return;
  }
});

module.exports = router;
