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
const bookingBeds = await bookingBad.find();
for (let i = 0; i < bookingBeds.length; i++) {
  if(bookingBeds[i].Adhar == req.body.Adhar)
  {
    res.status(400).send("adhar is already exist");
    return;
  }
}
    const otp = Math.floor(100000 + Math.random() * 900000);
    console.log(otp);

    let bads_allot = new bookingBad({
      hospitalId: Id,
      patientName: req.body.patientName,
      Adhar: req.body.Adhar,
      email: req.body.email,
      age: req.body.age,
      type: req.body.type,
      otp: otp,
    });
    await bads_allot.save();
    const badallotid = bads_allot._id;

    const findbad = await Bad.find({
      hospitalId: Id,
    });
    const badid = findbad[0]._id;
    console.log(bads_allot.id);

    /// otp sent to your email
    console.log(bads_allot.email);
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.AUTHEREMAIL,
        pass: process.env.AUTHERPASS,
      },
    });

    const mailOptions = {
      from: process.env.AUTHEREMAIL,
      to: bads_allot.email,
      subject: "Otp for verification",
      text: `your otp is given below \n ${bads_allot.otp}`,
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("OTP sent");
      }
    });

    const msg = "Otp has been sent";
    const otpsent = bads_allot.otp;
    res.status(201).send({ msg, badallotid, badid, otpsent });
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
    const findHospital = await Hospital.findById(findbad[0].hospitalId);
    const hosName = findHospital.name;
    const hosEmail = findHospital.email;
    // console.log(hosName);
    // otp
    const otpVerify = req.body.otp;
    const emailpatient = findbadallot[0].email;
    // console.log(emailpatient);
    if (otpVerify === findbadallot[0].otp) {
      if (findbadallot[0].bookingFlag === false) {
        if (findbadallot[0].type == "General") {
          const badupdateNum = findbad[0].generalType.availbility - 1;
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

          /// after otp verification

          const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: process.env.AUTHEREMAIL,
              pass: process.env.AUTHERPASS,
            },
          });

          const mailOptions = {
            from: process.env.AUTHEREMAIL,
            to: emailpatient,
            subject: "Booking confirmation",
            text: `Your bed has been booked via WeCare. \n Booking Details:\n  Bed Type : ${type} \n Bed Price : ${priceperbad}Rs \n Hospital Name : ${hosName} \n Bed Id: ${bad_allotId} \nPlease confirm the booking by reaching hospital within 3 hours. \n For any help, contact the hospital at ..\n ${hosEmail}`,
          };
          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              console.log(error);
            } else {
              console.log("OTP sent");
            }
          });
        } else if (findbadallot[0].type == "Special") {
          const badupdateNum = findbad[0].specialType.availbility - 1;
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

          /// after otp verification

          const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: process.env.AUTHEREMAIL,
              pass: process.env.AUTHERPASS,
            },
          });

          const mailOptions = {
            from: process.env.AUTHEREMAIL,
            to: emailpatient,
            subject: "Booking confirmation",
            text: `Your bed has been booked via WeCare. \n Booking Details:\n  Bed Type : ${type} \n Bed Price : ${priceperbad}Rs \n Hospital Name : ${hosName} \n Bed Id: ${bad_allotId}\n For any help, contact the hospital at ..\n ${hosEmail}`,
          };
          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              console.log(error);
            } else {
              console.log("OTP sent");
            }
          });
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
//hospital

router.put("/bookingbyhospital", verify, async (req, res) => {
  try {
    const isVerified = true;
    const token = req.body.cookie_token;
    const dec = token.split(".")[1];
    const decode = JSON.parse(atob(dec)); //contains hospitalid

    const otp = Math.floor(100000 + Math.random() * 900000);
    console.log(otp);
    let bads_allot = new bookingBad({
      hospitalId: decode._id,
      patientName: req.body.patientName,
      Adhar: req.body.Adhar,
      email: req.body.email,
      age: req.body.age,
      type: req.body.type,
      otp: otp,
    });
    await bads_allot.save();
    console.log(bads_allot);
    const badallotid = bads_allot._id;

    const findbad = await Bad.find({
      hospitalId: decode._id,
    });
    const badid = findbad[0]._id;

    /// otp sent to your email
    console.log(bads_allot.email);
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.AUTHEREMAIL,
        pass: process.env.AUTHERPASS,
      },
    });

    const mailOptions = {
      from: process.env.AUTHEREMAIL,
      to: bads_allot.email,
      subject: "Otp for verification",
      text: `your otp is given below \n ${bads_allot.otp}`,
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("OTP sent");
      }
    });

    const msg = "Otp has been sent";
    const otpsent = bads_allot.otp;
    res.status(201).send({ msg, badallotid, badid, otpsent });
  } catch (err) {
    res.status(400).send(`err ${err}`);
  }
});

router.put("/bookingbyhospital/verify", verify, async (req, res) => {
  try {
    const isVerified = true;
    const token = req.body.cookie_token;
    const dec = token.split(".")[1];
    const decode = JSON.parse(atob(dec)); //contains hospitalid

    const bad_allotId = req.body.badallotid;
    const findbadallot = await bookingBad.find({
      _id: bad_allotId,
    });
    const badId = req.body.badid;
    const findbad = await Bad.find({
      _id: badId,
    });
    const findHospital = await Hospital.findById(decode);
    const hosName = findHospital.name;
    const hosEmail = findHospital.email;
    // console.log(hosName);
    // otp
    const otpVerify = req.body.otp;
    const emailpatient = findbadallot[0].email;
    // console.log(emailpatient);
    if (otpVerify === findbadallot[0].otp) {
      if (findbadallot[0].bookingFlag === false) {
        if (findbadallot[0].type == "General") {
          const badupdateNum = findbad[0].generalType.availbility - 1;
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

          /// after otp verification
          const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: process.env.AUTHEREMAIL,
              pass: process.env.AUTHERPASS,
            },
          });

          const mailOptions = {
            from: process.env.AUTHEREMAIL,
            to: emailpatient,
            subject: "Booking confirmation",
            text: `Your bed has been booked via WeCare. \n Booking Details:\n  Bed Type : ${type} \n Bed Price : ${priceperbad}Rs \n Hospital Name : ${hosName} \n Bed Id: ${bad_allotId} \nPlease confirm the booking by reaching hospital within 3 hours. \n For any help, contact the hospital at ..\n ${hosEmail}`,
          };
          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              console.log(error);
            } else {
              console.log("OTP sent");
            }
          });
        } else if (findbadallot[0].type == "Special") {
          const badupdateNum = findbad[0].specialType.availbility - 1;
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

          /// after otp verification

          const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: process.env.AUTHEREMAIL,
              pass: process.env.AUTHERPASS,
            },
          });

          const mailOptions = {
            from: process.env.AUTHEREMAIL,
            to: emailpatient,
            subject: "Booking confirmation",
            text: `Your bed has been booked via WeCare. \n Booking Details:\n  Bed Type : ${type} \n Bed Price : ${priceperbad}Rs \n Hospital Name : ${hosName} \n Bed Id: ${bad_allotId} \nPlease confirm the booking by reaching hospital within 3 hours. \n For any help, contact the hospital at ..\n ${hosEmail}`,
          };
          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              console.log(error);
            } else {
              console.log("OTP sent");
            }
          });
        }
        const updateBookinngFlag = await bookingBad.findOneAndUpdate(
          {
            _id: bad_allotId,
          },
          {
            $set: {
              bookingFlag: true,
              hospitalFlag: true,
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
router.put("/hospital/bookingbads/:type", verify, async (req, res) => {
  try {
    const isVerified = true;
    const token = req.body.cookie_token;
    const dec = token.split(".")[1];
    const decode = JSON.parse(atob(dec)); //contains hospitalid

    const findBookingbad = await bookingBad.find({ hospitalId: decode });
    let type = req.params.type;
    let generalbed = [],
      specialbed = [];
    for (let i = 0; i < findBookingbad.length; i++) {
      if (
        findBookingbad[i].bookingFlag === true &&
        findBookingbad[i].type == "General"
      ) {
        generalbed.push(findBookingbad[i]);
      }
    }
    for (let i = 0; i < findBookingbad.length; i++) {
      if (
        findBookingbad[i].bookingFlag === true &&
        findBookingbad[i].type == "Special"
      ) {
        specialbed.push(findBookingbad[i]);
      }
    }
    if (type == "General") res.status(200).send(generalbed);
    else res.status(200).send(specialbed);
  } catch (err) {
    res.status(400).send(`err ${err}`);
  }
});

// get by patient

router.post("/patient/bookingbads", async (req, res) => {
  try {
    const email = req.body.email;
    const findBookingbad = await bookingBad.find({ email: email });
    let bookingTure = [];

    for (let i = 0; i < findBookingbad.length; i++) {
      if (findBookingbad[i].bookingFlag === true) {
        let res1 = findBookingbad[i];
        const hospitalRes = await Hospital.findById(
          findBookingbad[i].hospitalId
        );
        bookingTure.push({ res1, hospitalRes });
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
    console.log(req.params.id.trim());
    const findBookingbad = await bookingBad.findById(req.params.id.trim());
    console.log(findBookingbad);
    res.status(200).send(findBookingbad);
  } catch (err) {
    res.status(400).send(`err ${err}`);
  }
});
router.delete("/booking/:id", async (req, res) => {
  try {
    const findBookingbad = await bookingBad.findById(
      req.params.id.trim()
    );
    const findBookingbad2 = await bookingBad.findByIdAndDelete(
      req.params.id.trim()
    );
    const id = findBookingbad.hospitalId;
    const findBed = await Bad.find({ hospitalId: id });
    console.log(findBed);
    const emailpatient = findBookingbad.email;
    if (findBookingbad.type == "General") {
      const badupdateNum = findBed[0].generalType.availbility + 1;
      const priceperbad = findBed[0].generalType.pricePerbad;
      const type = findBed[0].generalType.type;
      // console.log(badupdateNum);
      const data = await Bad.findOneAndUpdate(
        {
          _id: findBed[0]._id,
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
      /// opt for discharged

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.AUTHEREMAIL,
          pass: process.env.AUTHERPASS,
        },
      });

      const mailOptions = {
        from: process.env.AUTHEREMAIL,
        to: emailpatient,
        subject: "discharged",
        text: `You have been discharged\n We wish for a healthy life`,
      };
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("OTP sent");
        }
      });
    } else {
      const badupdateNum = findBed[0].specialType.availbility + 1;
      const priceperbad = findBed[0].specialType.pricePerbad;
      const type = findBed[0].specialType.type;
      // console.log(badupdateNum);
      const data = await Bad.findOneAndUpdate(
        {
          _id: findBed[0]._id,
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
      /// opt for discharged

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.AUTHEREMAIL,
          pass: process.env.AUTHERPASS,
        },
      });

      const mailOptions = {
        from: process.env.AUTHEREMAIL,
        to: emailpatient,
        subject: "discharged",
        text: `You have been discharged\n We wish for a healthy life`,
      };
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("OTP sent");
        }
      });
    }

    res.status(200).send("Booking has been deleted.");
  } catch (err) {
    res.status(400).send(`err ${err}`);
  }
});

router.put("/patientbadconfirm", verify, async (req, res) => {
  try {
    const isVerified = true;
    const token = req.body.cookie_token;
    const dec = token.split(".")[1];
    const decode = JSON.parse(atob(dec)); //contains hospitalid
    const bookingId = req.body.bookingId;
    const findbooking = await bookingBad.find({ hospitalId: decode._id });
    if (!findbooking) res.status(404).send(`err ${err}`);
    let bookinBed = [];
    for (let i = 0; i < findbooking.length; i++) {
      if (findbooking[i]._id == bookingId) {
        bookinBed.push(findbooking[i]);
        const updateBookinngFlag = await bookingBad.findOneAndUpdate(
          {
            _id: bookingId,
          },
          {
            $set: {
              hospitalFlag: true,
            },
          }
        );
        break;
      }
    }
    res.status(200).send(bookinBed);
  } catch (err) {
    res.status(500).send(`err ${err}`);
  }
});

module.exports = router;
