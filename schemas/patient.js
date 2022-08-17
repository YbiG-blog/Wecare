require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");

const PatientSchema = new mongoose.Schema({
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
  gender: { type: String, required: true },
  state: { type: String, required: true },
  district: { type: String, required: true },
  distance : { type : Number, required: true}
});

// token generate---------
PatientSchema.methods.generateAuthToken = async function () {
  try {
    const pay_load = { _id: this._id };
    const token = jwt.sign(pay_load, process.env.TOKEN_SECRET_KEY);
    return token;
  } catch (err) {
    return err;
  }
};
// password encryption------------
PatientSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, saltRounds);
  }
  next();
});

const Patient = new mongoose.model("Patient", PatientSchema);
module.exports = Patient;

//    --------patient registration-------
//     name : String,
//     email: String
//     mobileNum: Number
//     password: String
//     district
//     state
