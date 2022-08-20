require("dotenv").config();
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
  hospitalId: { type: Schema.Types.ObjectId, ref: "Hospital" },
  patientName: { type: String, required: true, minlength: 3 },
  email: { type: String, required: true, unique: false },
  phoneNum: { type: Number, required: true },
  age: { type: Number, required: true },
  address: { type: String, required: true },
  NumberofBads : { type: Number, required: true },
  type : { type: String, required: true },
  otp:{
    type: Number, required: true
  },
  bookingFlag : { type: Boolean, default : false}
});

const Bookingbad = new mongoose.model("Bookingbad", bookingSchema);
module.exports = Bookingbad;
