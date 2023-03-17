require("dotenv").config();
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
  hospitalId: { type: Schema.Types.ObjectId, ref: "Hospital" },
  patientName: { type: String, required: true, minlength: 3 },
  Adhar: { type: Number, required: true, minlength: 12, maxlength: 12,unique: true },
  email: { type: String, required: true },
  age: { type: Number, required: true },
  type: { type: String, required: true },
  price: { type: Number, required: true },
  otp: {  type: Number, required: true },
  bookingFlag: { type: Boolean, default: false },
  hospitalFlag: { type: Boolean, default: false },
},{ timestamps: true }); 

const Bookingbed = new mongoose.model("Bookingbed", bookingSchema);
module.exports = Bookingbed;
