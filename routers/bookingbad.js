require("dotenv").config();
const express = require("express");
const router = new express.Router();
const bookingBad = require("../schemas/booking");
const Bad  = require("../schemas/bads")
const atob = require("atob");
const verify = require("../middleware/auth");
const nodemailer = require("nodemailer")

router.put("/booking/:id", async (req, res) => {
    try {       
  const badId = req.params.id;
  console.log(badId);
  const badData = await Bad.findById({_id:badId});
  // console.log(badData);
//   const { patientName, email } = await req.body;
  let bads_allot = new bookingBad({
    hospitalId : badData.hospitalId,
    badId : badId,
    patientName : req.body.patientName,
    email: req.body.email,
  });
  await bads_allot.save();
  console.log(bads_allot);
  // confirm otp

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

res.status(201).send("your bad has been booked and details send to your email");

} catch (err) {
    res.status(400).send(`err ${err}`);
}
});

// router.put("/bookingbad", verify, async(req,res)=>{
//   try {
//     const isVerified = true;
//     const token = req.body.cookie_token;
//     const dec = token.split(".")[1];
//     const decode = JSON.parse(atob(dec)); //contains Userid
//     console.log(decode);

//     const findbookingBad = bookingBad.findById({hospitalId:decode>_id});
//     res.status(200).send(findbookingBad);

//   } catch (err) {
//     res.status(400).send(`err ${err}`);
//   }
//   });

module.exports = router;
