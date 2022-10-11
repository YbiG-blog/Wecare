require("dotenv").config();
const mongoose = require("mongoose");

const HospitalSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 3 },
  email: { type: String, required: true, unique: true },
  mobileNum: {
    type: Number,
    required: true,
    maxlength: 10,
    minlength: 10,
    unique: true,
  },
  password: { type: String, required: true },
  address : { type: String, required: true },
  state: { type: String, required: true },
  city: { type: String, required: true },
  pincode: {  type: Number,
    required: true,
    maxlength: 6,
    minlength: 6 },
  hospitalType: { type: Boolean, default: false }, // private or government ... true for - government and false for - private
});



const Hospital = new mongoose.model("Hospital", HospitalSchema);
module.exports = Hospital;

//    --------hospital registration-------
//     name : String,
//     email: String
//     mobileNum: Number
//     password: String
//     pass - hospital