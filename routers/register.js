const express = require("express");
const router = new express.Router();
const Hospital = require("../schemas/hospital");
const Bads = require("../schemas/bad");
const jwt = require("jsonwebtoken");


router.get("/hospital/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const dataHos = await Hospital.findById(id);
    const badData = await Bads.find();

    for (let i = 0; i < badData.length; i++) {
      if(badData[i].hospitalId == id)
      {
       var matchbadData = badData[i];
        console.log(matchbadData);
        break;
      }
    }  


    res.status(200).send({ dataHos, matchbadData });
  } catch (err) {
    res.status(400).send(err);
  }
});
// update hospital
router.patch("/hospital/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const data = await Hospital.findOneAndUpdate(
      {
        _id: id,
      },
      {
        $set: req.body,
      }
    );
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
    const {
      name,
      email,
      Hospitalid,
      mobileNum,
      password,
      address,
      state,
      city,
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
      Hospitalid,
      mobileNum,
      password,
      address,
      state,
      city,
      hospitalType,
    });

    const save = await hospital_create.save();
    // token
    const pay_load = { _id: hospital_create._id };
    console.log(hospital_create.Hospitalid);
    const token = jwt.sign(pay_load, process.env.TOKEN_SECRET_KEY);
    res.status(201).send({ save, token });
  } catch (err) {
    res.status(400).send(`error ${err}`);
  }
});

// router.get("/patient/:id", async (req, res) => {
//   try {
//     const id = req.params.id;
//     const data = await Patient.findById(id);
//     res.status(200).send(data);
//   } catch (err) {
//     res.status(400).send(err);
//   }
// });
// update patient
// router.patch("/patient/:id", async (req, res) => {
//   try {
//     const id = req.params.id;
//     const data = await Patient.findOneAndUpdate({
//       _id: id
//     },{
//       $set: req.body
//     });
//       res.status(200).send("Account Updated");
//   } catch (err) {
//     res.status(400).send(err);
//   }
// });
// delete patient
// router.delete("/patient/:id", async (req, res) => {
//   try {
//     const id = req.params.id;
//     const data = await Patient.findByIdAndDelete(id);
//     res.status(200).json("Account deleted");
//   } catch (err) {
//     console.log(err);
//     return res.status(400).json(err);
//   }
// });
// router.post("/registerpatient", async (req, res) => {
//   const otp = Math.floor(Math.floor(100000 + Math.random() * 900000));
//   try {
//     const { name, email, mobileNum, password, gender, state, city, address } =
//       await req.body;
//     const patientExist = await Patient.findOne({ email });

//     if (patientExist) {
//       return res.status(200).send({ msg: "already exists." });
//     }

//     const patient_create = new Patient({
//       name,
//       email,
//       mobileNum,
//       password,
//       gender,
//       state,
//       city,
//       address
//     });

//     const save = await patient_create.save();

//     res.status(201).send(save);
//   } catch (err) {
//     res.status(400).send(err);
//   }
// });

module.exports = router;
