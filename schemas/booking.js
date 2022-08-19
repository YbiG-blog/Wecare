require("dotenv").config();
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
  patientName : { type: String, required: true, minlength: 3  },
  email: { type: String, required: true, unique: true }
});

const Bookingbad = new mongoose.model("Bookingbad", bookingSchema);
module.exports = Bookingbad;
