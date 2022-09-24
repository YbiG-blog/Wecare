require("dotenv").config();
const express = require("express");
const router = new express.Router();
const bookingBed = require("../models/booking");
const Bed = require("../models/bed");
const Hospital = require("../models/hospital");
const atob = require("atob");
const jwtDecode = require("jwt-decode");
const verify = require("../middleware/auth");
const sendEmail = require("../services/email");

router.put("/booking/:id", async ({ body, params }, res) => {
  try {
    const Id = params.id;
    const findBed = await Bed.findOne({ hospitalId: Id });
    const otp = Math.floor(100000 + Math.random() * 900000);

    const { patientName, Adhar, email, age, type } = body;
    let bed_allot = new bookingBed({
      hospitalId: Id,
      patientName,
      Adhar,
      email,
      age,
      type,
      otp: otp,
    });
    bed_allot.save();
    const text = `Please verify with below otp \n ${otp}`,
      subject = "otp vefication",
      userEmail = bed_allot.email;
    /// otp sent
    sendEmail(userEmail, subject, text);

    const msg = "Otp has been sent";
    const bedAllotId = bed_allot._id,
      bedId = findBed._id;
    res.status(201).send({ msg, bedAllotId, bedId, otp });
  } catch (err) {
    res.status(400).send(`err ${err}`);
  }
});

router.put("/bookingbed/verify", async ({ body }, res) => {
  try {
    const { bedAllotId, bedId, otp } = body;
    const findbedAllot = await bookingBed.findById(bedAllotId);
    const findbed = await Bed.findById(bedId);
    const findHospital = await Hospital.findById(findbed.hospitalId);
    const hosName = findHospital.name,
      hosEmail = findHospital.email,
      emailpatient = findbedAllot.email;

    let bedUpdateNum = 0,
      priceperbad = 0,
      type = "";
    if (otp === findbedAllot.otp) {
      if (findbedAllot.bookingFlag === false) {
        if (findbedAllot.type == "General") {
          (bedUpdateNum = findbed.generalType.availbility - 1),
            (priceperbad = findbed.generalType.pricePerbad),
            (type = findbed.generalType.type);
          await Bed.findOneAndUpdate(
            {
              _id: bedId,
            },
            {
              $set: {
                specialType: {
                  type: type,
                  availbility: bedUpdateNum,
                  pricePerbad: priceperbad,
                },
              },
            }
          );
        } else if (findbedAllot.type == "Special") {
          (bedUpdateNum = findbed.specialType.availbility - 1),
            (priceperbad = findbed.specialType.pricePerbad),
            (type = findbed.specialType.type);
          await Bed.findOneAndUpdate(
            {
              _id: bedId,
            },
            {
              $set: {
                specialType: {
                  type: type,
                  availbility: bedUpdateNum,
                  pricePerbad: priceperbad,
                },
              },
            }
          );
        }

        await bookingBed.findByIdAndUpdate(bedAllotId, {
          $set: {
            bookingFlag: true,
          },
        });
        const text = `Your bed has been booked via WeCare. \n Booking Details:\n  Bed Type : ${type} \n Bed Price : ${priceperbad}Rs \n Hospital Name : ${hosName} \n Bed Id: ${bedAllotId}\n For any help, contact the hospital at ..\n ${hosEmail}`,
          subject = "booking confirmation",
          userEmail = emailpatient;
        /// confirmationn email sent
        sendEmail(userEmail, subject, text);
        res.status(200).send("your bed has been booked");
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

router.put("/bookingbyhospital", verify, async ({ body }, res) => {
  try {
    const token = body.cookie_token;
    const decode = jwtDecode(token); // hospitalId
    const findBed = await Bed.findOne({ hospitalId: decode });
    const otp = Math.floor(100000 + Math.random() * 900000);

    const { patientName, Adhar, email, age, type } = body;
    let bed_allot = new bookingBed({
      hospitalId: decode,
      patientName,
      Adhar,
      email,
      age,
      type,
      otp: otp,
    });
    bed_allot.save();
    const text = `Please verify with below otp \n ${otp}`,
      subject = "otp vefication",
      userEmail = bed_allot.email;
    /// otp sent
    sendEmail(userEmail, subject, text);

    const msg = "Otp has been sent";
    const bedAllotId = bed_allot._id,
      bedId = findBed._id;
    res.status(201).send({ msg, bedAllotId, bedId, otp });
  } catch (err) {
    res.status(400).send(`err ${err}`);
  }
});

router.put("/bookingbyhospital/verify", verify, async ({ body }, res) => {
  try {
    const token = body.cookie_token;
    const decode = jwtDecode(token);
    const { _id } = decode; // hospitalId
    const { bedAllotId, bedId, otp } = body;
    const findbedAllot = await bookingBed.findById(bedAllotId);
    const findbed = await Bed.findById(bedId);
    const findHospital = await Hospital.findById(_id);
    const hosName = findHospital.name,
      hosEmail = findHospital.email,
      emailpatient = findbedAllot.email;

    let bedUpdateNum = 0,
      priceperbad = 0,
      type = "";
    if (otp === findbedAllot.otp) {
      if (findbedAllot.bookingFlag === false) {
        if (findbedAllot.type == "General") {
          (bedUpdateNum = findbed.generalType.availbility - 1),
            (priceperbad = findbed.generalType.pricePerbad),
            (type = findbed.generalType.type);
          await Bed.findOneAndUpdate(
            {
              _id: bedId,
            },
            {
              $set: {
                specialType: {
                  type: type,
                  availbility: bedUpdateNum,
                  pricePerbad: priceperbad,
                },
              },
            }
          );
        } else if (findbedAllot.type == "Special") {
          (bedUpdateNum = findbed.specialType.availbility - 1),
            (priceperbad = findbed.specialType.pricePerbad),
            (type = findbed.specialType.type);
          await Bed.findOneAndUpdate(
            {
              _id: bedId,
            },
            {
              $set: {
                specialType: {
                  type: type,
                  availbility: bedUpdateNum,
                  pricePerbad: priceperbad,
                },
              },
            }
          );
        }

        await bookingBed.findByIdAndUpdate(bedAllotId, {
          $set: {
            bookingFlag: true,
            hospitalFlag: true,
          },
        });
        const text = `Your bed has been booked via WeCare. \n Booking Details:\n  Bed Type : ${type} \n Bed Price : ${priceperbad}Rs \n Hospital Name : ${hosName} \n Bed Id: ${bedAllotId}\n For any help, contact the hospital at ..\n ${hosEmail}`,
          subject = "booking confirmation",
          userEmail = emailpatient;
        /// confirmationn email sent
        sendEmail(userEmail, subject, text);
        res.status(200).send("your bed has been booked");
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

// get hospital by its bed type
router.put(
  "/hospital/bookingbeds/:type",
  verify,
  async ({ body, params }, res) => {
    try {
      const token = body.cookie_token;
      const decode = jwtDecode(token);
      const { _id } = decode; //contains hospitalid
      const findBookingBed = await bookingBed.find({ hospitalId: _id });
      const type = params.type;
      let totalBeds = [];
      findBookingBed.forEach((e) => {
        if (e.type == type) {
          totalBeds.push(e);
        }
      });
      res.status(200).send(totalBeds);
    } catch (err) {
      res.status(400).send(`err ${err}`);
    }
  }
);

// get by patient

router.post("/patient/bookingbeds", async ({ body }, res) => {
  try {
    const { email } = body;
    const findBookingbad = await bookingBed
      .find(
        { email: email },
        {
          _id: 1,
          Adhar: 1,
          email: 1,
          hospitalId: 1,
        }
      )
      .populate("hospitalId", "name email address");
    res.status(200).send(findBookingbad);
  } catch (err) {
    res.status(400).send(`err ${err}`);
  }
});
/// id : bookingbadId
router.get("/booking/:id", async ({ params }, res) => {
  try {
    const findBookingbed = await bookingBed.findById(params.id);
    if (!findBookingbed)
      return res.status(404).send("Oops! \nbooking data not found");
    res.status(200).send(findBookingbed);
  } catch (err) {
    res.status(400).send(`err ${err}`);
  }
});
router.delete("/booking/:id", async ({ params }, res) => {
  try {
    const findBookingbed = await bookingBed.findById(params.id);
    if (!findBookingbed)
      return res.status(404).send("Oops! \nbooking data not found");
    const findBookingbad2 = await bookingBed.findByIdAndDelete(params.id);
    const Id = findBookingbed.hospitalId;
    const findBed = await Bed.find({ hospitalId: Id });
    if (findBookingbed.type == "General") {
      const badupdateNum = findBed[0].generalType.availbility + 1;
      const priceperbad = findBed[0].generalType.pricePerbad;
      const type = findBed[0].generalType.type;
      await Bed.findOneAndUpdate(
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
    } else {
      const badupdateNum = findBed[0].specialType.availbility + 1;
      const priceperbad = findBed[0].specialType.pricePerbad;
      const type = findBed[0].specialType.type;
      await Bed.findOneAndUpdate(
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
    }
    /// opt for discharged
    const text = `You have been discharged\n We wish for a healthy life`,
      subject = "discharged",
      userEmail = findBookingbed.email;
    /// opt for discharged
    sendEmail(userEmail, subject, text);
    res.status(200).send("Booking has been deleted.");
  } catch (err) {
    res.status(400).send(`err ${err}`);
  }
});

module.exports = router;
