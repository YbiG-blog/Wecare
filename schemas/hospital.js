require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;


const HospitalSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 3 },
  email: { type: String, required: true, unique: true },
  mobileNum: { type: Number, required: true, maxlength: 10, minlength: 10, unique: true, },
  password: { type: String },
  gender: { type: String, required: true },
});

// password encryption------------
HospitalSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, saltRounds);
  }
  next();
});

const Hospital = new mongoose.model("User", HospitalSchema);
module.exports = Hospital;

//    --------hospital registration-------
//     name : String,
//     email: String
//     mobileNum: Number
//     password: String