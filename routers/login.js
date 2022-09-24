const express = require("express");
const Hospital = require("../models/hospital");
const bcrypt = require("bcrypt");
const router = new express.Router();
const jwt = require("jsonwebtoken");

// login route for hospital
router.post("/loginhospital", async ({body}, res) => {
  try {
    const {password, email} = body;

    const hospitalCheck = await Hospital.findOne({ email: email });
    if (hospitalCheck) {
      const match_password = bcrypt.compare(
        password,
        hospitalCheck.password
      );
      // token generate
      const pay_load = { _id: hospitalCheck._id };
      const cookie_token = jwt.sign(pay_load, process.env.TOKEN_SECRET_KEY);

      //add cookie
      res.cookie("jwt_shi23", cookie_token, {
        secure: true,
        expires: new Date(Date.now() + 864000000),
        httpOnly: false,
      });
      if (match_password) {
        res.status(200).send({
          message: " hospital logged in successfully",
          cookie_token: cookie_token,
          hosId : hospitalCheck._id
        });
      } else {
        res.status(400).send({ msg: "Wrong Password" });
      }
    } else {
      res.status(400).send({ msg: "Invalid details" });
    }
  } catch (err) {
    console.log(err);
  }
});

//logout router

router.post("/logout", async (req, res) => {});

module.exports = router;
