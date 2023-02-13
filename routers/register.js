const express = require("express");
const router = new express.Router();
const Hospital = require("../models/hospital");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const Bed = require("../models/bed");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

// get  post req
router.post("/hospitalbyId", async ({ body }, res) => {
  try {
    const { _id } = body;
    const dataArray = await Bed.aggregate([
      {$match : { hospitalId: ObjectId(_id) }},
        {$lookup :{
        from : "hospitals",
        localField : "hospitalId",
        foreignField : "_id",
        as : "hospitalId"   }},
     {$project : { _id : 0, city : 0 }} ]);
    if(!dataArray) return res.status(401).json( "This id does not have any account / please add beds details." );
   return res.status(200).json({"result" : dataArray } );
  } catch (err) {
    console.log(`err : ${ err.message }`);    
    return res.status(500).json(err);
  }
});

router.get("/hospital/:_id", async ({ params }, res) => {
  try {
    const { _id } = params;
    const dataArray = await Bed.aggregate([
    {$match : { hospitalId: ObjectId(_id) }},
      {$lookup :{
      from : "hospitals",
      localField : "hospitalId",
      foreignField : "_id",
      as : "hospitalId"   }},
    {$project : { _id : 0, city : 0 }} ]);
    if(!dataArray) return res.status(401).json( "This id does not have any account / please add beds details." );
   return res.status(200).json({"result" : dataArray });
  } catch (err) {
    console.log(`err : ${ err.message }`);    
    return res.status(500).json(err);
  }
});

// update hospital
router.patch("/hospital/:_id", async ({ body, params }, res) => {
  try {
    const { _id } = params;
   const data = await Hospital.findByIdAndUpdate( _id,
      { $set: body } );
    if(!data) return res.status(401).json("This id dose not have any account.");
    return res.status(200).send({ msg :"Account Updated", data : data });
  } catch (err) {
    console.log(`err : ${ err.message }`);    
   return res.status(500).json(err);
  }
});
// delete hospital
router.delete("/hospital/:_id", async ({ params }, res) => {
  try {
    const { _id } = params;
    const data = await Hospital.findByIdAndDelete( _id );
    if(!data) return res.status(401).json("This id dose not have any account.");
    return res.status(200).json("Account deleted");
  } catch (err) {
    console.log(`err : ${ err.message }`);
   return  res.status(500).json(err);
  }
});

router.post("/register", async ({ body }, res) => {
  try {
    let {
      name, email, mobileNum, password, address, state, city, pincode, hospitalType,
    } =  body;
    const hospitalExist = await Hospital.findOne({ email });
    if (hospitalExist) {
      return res.status(403).send({ msg: "already exists." });
    }
    // const cookie_token = await  Hospital.generateAuthToken();
     city = city.toLowerCase();
    const hospital_create = new Hospital({
    name, email, mobileNum, password, address, state, city, pincode, hospitalType });
    // password encryption------------
    hospital_create.password = await bcrypt.hash( hospital_create.password,  saltRounds  );
    const save = await hospital_create.save();

    // token
    const pay_load = { _id: hospital_create._id , city : hospital_create.city };
    const token = jwt.sign( pay_load, process.env.TOKEN_SECRET_KEY);

    return res.status(201).send({ save, token, });
  } catch (err) {
   return res.status(400).send(`error ${err}`);
  }
});

module.exports = router;
