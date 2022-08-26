require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");

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

// token generate---------
HospitalSchema.methods.generateAuthToken = async function () {
  try {
    const pay_load = { _id: this._id };
    const token = jwt.sign(pay_load, process.env.TOKEN_SECRET_KEY);
    return token;
  } catch (err) {
    return err;
  }
};
// password encryption------------
HospitalSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, saltRounds);
  }
  next();
});

const Hospital = new mongoose.model("Hospital", HospitalSchema);
module.exports = Hospital;

//    --------hospital registration-------
//     name : String,
//     email: String
//     mobileNum: Number
//     password: String
//     pass - hospital