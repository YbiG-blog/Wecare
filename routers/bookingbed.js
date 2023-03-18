require("dotenv").config();
const express = require("express");
const router = new express.Router();
const BookingBed = require("../models/booking");
const Bed = require("../models/bed");
const verify = require("../middleware/auth");
const sendEmail = require("../services/email");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

router.put("/booking/:_id", async ({ body, params }, res) => {
  try {
    const { _id } = params;
    const { patientName, Adhar, email, age, type, price } = body;
    if( await BookingBed.findOne( { Adhar} )) return res.status(401).json("This Adhar already used by others.");

    const findBed = await Bed.findOne({ hospitalId: _id }).populate("hospitalId", "name email");
    const OTP = Math.floor(100000 + Math.random() * 900000);
    let AllotBed = new BookingBed({
      hospitalId: _id, patientName, Adhar, email, age, type, price, otp: OTP });
      AllotBed.save();
    const text = `Please verify with below otp \n ${OTP}`,
      subject = "otp vefication",
      userEmail = AllotBed.email;
    /// otp sent
    sendEmail(userEmail, subject, text);
    const msg = "Otp has been sent", bedId = findBed._id, hosName = findBed.hospitalId.name, hosEmail = findBed.hospitalId.email, bookingId = AllotBed._id ;
    return res.status(201).json({ msg, bookingId, bedId, hosEmail, hosName, OTP, userEmail });
  } catch (err) {
   return res.status(500).send(`err ${err}`);
  }
});

router.put("/bookingbed/verify", async ({ body }, res) => {
  try {
    const { bookingId, bedId, hosEmail, hosName, OTP } = body;
   const findbooking = await BookingBed.findById( { _id : bookingId} );
   const { generalType, specialType  } = await Bed.findById({ _id : bedId})
    if (OTP === findbooking.otp) { if (findbooking.bookingFlag === false) {
        if (findbooking.type == "General") {  
          await Bed.findByIdAndUpdate({ _id : bedId },
          {$set : { generalType: { availbility : generalType.availbility -1, pricePerbad : generalType.pricePerbad, type :"General"  } }});  } 
        else if (findbooking.type == "Special") {
          await Bed.findByIdAndUpdate({ _id : bedId },
            {$set : { specialType: { availbility : specialType.availbility -1, pricePerbad : specialType.pricePerbad, type :"Special"} }});  }
            // update booking
            await BookingBed.findByIdAndUpdate({ _id : bookingId }, {  $set: { bookingFlag: true} });   
        const text = `Your bed has been booked via WeCare. \n Booking Details:\n  Bed Type : ${findbooking.type} \n Bed Price : ${findbooking.price}Rs \n Hospital Name : ${hosName} \n Bed Id: ${findbooking._id}\n For any help, contact the hospital at ..\n ${hosEmail}`,
        subject = "booking confirmation";
        /// confirmationn email sent
        sendEmail(findbooking.email, subject, text);
        res.status(200).send("your bed has been booked");
      }
      else { return res.status(401).send("go to booking page and try to book again");  }
    } else { return res.status(401).send("otp is not verified");  }
  } catch (err) {
   return res.status(500).send(`err ${err}`); }
});

// get hospital by its bed type
router.put("/hospital/bookingbeds/:type", verify, async ( req , res) => {
    try {
      const { type } = req.params;
      const dataArray = await BookingBed.aggregate([
        {$match : { type : type}}
      ]);
      if(dataArray.length==0) return res.status(404).json("data not found");
     return res.status(200).json(dataArray);
    } catch (err) {
     return res.status(500).send(`err ${err}`);
    }
  }
);

// get by patient

router.post("/patient/bookingbeds", async ({ body }, res) => {
  try {
    const { email } = body;
    const findBookingbed = await BookingBed.findOne(
        { email: email },{ Adhar: 1, email: 1,hospitalId: 1}
      ).populate("hospitalId", "name email address");
    return res.status(200).json(findBookingbed);
  } catch (err) {
    return res.status(500).send(`err ${err}`);
  }
});

/// id : bookingbedId
router.get("/booking/:_id", async ({ params }, res) => {
  try {
    const { _id } = params;
    const findBookingbed = await BookingBed.findById( _id );
    if (!findBookingbed)  return res.status(404).send("Oops! \nbooking data not found");
   return res.status(200).send(findBookingbed);
  } catch (err) {
  return res.status(500).send(`err ${err}`);
  }
});
// delete bed
router.delete("/booking/:_id", async ({ params }, res) => {
  try {
    const { _id } = params;
    const findBookingbed = await BookingBed.findByIdAndDelete( _id );
    console.log(findBookingbed);
    if (!findBookingbed) return res.status(404).json("Oops! \nbooking data not found");
    const { hospitalId }= findBookingbed;
    const findBed = await Bed.findOne({ hospitalId: hospitalId });
    if (findBookingbed.type == "General") {
      await Bed.findByIdAndUpdate({ _id : findBed._id },
        {$set : { generalType: { availbility : findBed.generalType.availbility +1, pricePerbad : findBed.generalType.pricePerbad, type :"General"  } }});  } 
    else {
      await Bed.findByIdAndUpdate({ _id : findBed._id },
        {$set : { specialType: { availbility : findBed.specialType.availbility +1, pricePerbad : findBed.specialType.pricePerbad, type :"Special"} }});  }
    /// opt for discharged
    const text = `You have been discharged\n We wish for a healthy life`, subject = "discharged",
      userEmail = findBookingbed.email;
    sendEmail(userEmail, subject, text);
    return res.status(200).json("Booking has been deleted.");
  } catch (err) {
   return res.status(500).send(`err ${err}`);
  }
});

module.exports = router;
