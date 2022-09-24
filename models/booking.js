require("dotenv").config();
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
  // _id:{type:String},
  hospitalId: { type: Schema.Types.ObjectId, ref: "Hospital" },
  patientName: { type: String, required: true, minlength: 3 },
  Adhar: { type: Number, required: true, minlength: 12, maxlength: 12,unique: false},
  email: { type: String, required: true, unique: false },
  age: { type: Number, required: true },
  type: { type: String, required: true },
  otp: {
    type: Number,
    required: true,
  },
  bookingFlag: { type: Boolean, default: false },
  hospitalFlag: { type: Boolean, default: false },
},{ timestamps: true });

const Bookingbad = new mongoose.model("Bookingbad", bookingSchema);
module.exports = Bookingbad;
