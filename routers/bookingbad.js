require("dotenv").config();
const express = require("express");
const router = new express.Router();
const bookingBad = require("../schemas/booking");
const Bad = require("../schemas/bad");
const Hospital = require("../schemas/hospital");
const atob = require("atob");
const verify = require("../middleware/auth");
const nodemailer = require("nodemailer");

router.put("/booking/:id", async (req, res) => {
  try {
    const Id = req.params.id;

    const otp = Math.floor(100000 + Math.random() * 900000);
    console.log(otp);
    let bads_allot = new bookingBad({
      hospitalId: Id,
      patientName: req.body.patientName,
      email: req.body.email,
      phoneNum: req.body.phoneNum,
      age: req.body.age,
      address: req.body.address,
      NumberofBads: req.body.NumberofBads,
      type: req.body.type,
      otp: otp,
    });
    await bads_allot.save();
    const badallotid = bads_allot._id;

    const findbad = await Bad.find({
      hospitalId: Id,
    });
    const badId = findbad[0]._id;

    // const transporter = nodemailer.createTransport({
    //   service: "gmail",
    //   auth: {
    //     user: process.env.AUTHEREMAIL,
    //     pass: process.env.AUTHERPASS,
    //   },
    // });

    // const mailOptions = {
    //   from: process.env.AUTHEREMAIL,
    //   to: bads_allot.email,
    //   subject: "password forgot",
    //   text: `otp has been sent to your email for confirmation \n ${badData}`,
    // };
    // transporter.sendMail(mailOptions, function (error, info) {
    //   if (error) {
    //     console.log(error);
    //   } else {
    //     console.log("OTP sent");
    //   }
    // });
    // await Bad.findOneAndUpdate({
    //   _id: badId
    // },{
    //   $set: { booking : true }
    // });
    const msg = "your bad has been sent";
    res.status(201).send({ msg, badallotid, badId });
  } catch (err) {
    res.status(400).send(`err ${err}`);
  }
});

router.put("/bookingbad/verify", async (req, res) => {
  try {
    const bad_allotId = req.body.badallotid;
    const findbadallot = await bookingBad.find({
      _id: bad_allotId,
    });
    const badId = req.body.badid;
    const findbad = await Bad.find({
      _id: badId,
    });

    // otp
    const otpVerify = req.body.otp;

    if (otpVerify === findbadallot[0].otp) {
      if (findbadallot[0].bookingFlag === false) {
        if (findbadallot[0].type == "normal") {
          const badupdateNum =
            findbad[0].generalType.availbility - findbadallot[0].NumberofBads;
          const priceperbad = findbad[0].generalType.pricePerbad;
          const type = findbad[0].generalType.type;
          console.log(badupdateNum);
          const baddata = await Bad.findOneAndUpdate(
            {
              _id: badId,
            },
            {
              $set: {
                generalType: {
                  type: type,
                  availbility: badupdateNum,
                  pricePerbad: priceperbad,
                },
              },
            }
          );
        } else if (findbadallot[0].type == "special") {
          const badupdateNum =
            findbad[0].specialType.availbility - findbadallot[0].NumberofBads;
          const priceperbad = findbad[0].specialType.pricePerbad;
          const type = findbad[0].specialType.type;
          console.log(badupdateNum);
          const baddata = await Bad.findOneAndUpdate(
            {
              _id: badId,
            },
            {
              $set: {
                specialType: {
                  type: type,
                  availbility: badupdateNum,
                  pricePerbad: priceperbad,
                },
              },
            }
          );
        }
        const updateBookinngFlag = await bookingBad.findOneAndUpdate(
          {
            _id: bad_allotId,
          },
          {
            $set: {
              bookingFlag: true,
            },
          }
        );
        res.status(200).send("your bad has been booked");
      } else {
        res.status(400).send("go to booking page and try to book again");
      }
    } else {
      res.status(400).send("otp is not verified");
    }
  } catch (err) {
    res.status(400).send(`err ${err}`);
  }
});
// get by hospital
router.put("/hospital/bookingbads", async (req, res) => {
  try {
    const id = req.params.id;
    const isVerified = true;
    const token = req.body.cookie_token;
    const dec = token.split(".")[1];
    const decode = JSON.parse(atob(dec)); //contains hospitalid

    const findBookingbad = await bookingBad.find({ hospitalId: decode });
    let bookingTure = [];
    for (let i = 0; i < findBookingbad.length; i++) {
      if (findBookingbad[i].bookingFlag === true) {
        bookingTure.push(findBookingbad[i]);
      }
    }
    res.status(200).send(bookingTure);
  } catch (err) {
    res.status(400).send(`err ${err}`);
  }
});

// get by patient
router.post("/patient/bookingbads", async (req, res) => {
  try {
    const numMobile = req.body.phoneNum;
    const findBookingbad = await bookingBad.find({ phoneNum: numMobile });
    let bookingTure = [];

    for (let i = 0; i < findBookingbad.length; i++) {
      if (findBookingbad[i].bookingFlag === true) {
        bookingTure.push(findBookingbad[i]);
      }
    }
    res.status(200).send(bookingTure);
  } catch (err) {
    res.status(400).send(`err ${err}`);
  }
});

/// id : bookingbadId
router.get("/booking/:id", async (req, res) => {
  try {
    // const numMobile = req.body.phoneNum;
    const findBookingbad = await bookingBad.findById(req.params.id);
    res.status(200).send(findBookingbad);
  } catch (err) {
    res.status(400).send(`err ${err}`);
  }
});
router.delete("/booking/:id", async (req, res) => {
  try {
    const findBookingbad = await bookingBad.findByIdAndDelete(req.params.id);
    res.status(200).send("Booking has been deleted.");
  } catch (err) {
    res.status(400).send(`err ${err}`);
  }
});

module.exports = router;
