require("dotenv").config();
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const badSchema = new Schema({
  hospitalId: { type: Schema.Types.ObjectId, ref: "Hospital" },
  type: { type: String, required: true },
  price: { type: Number, required: true },
  otherFacilities:{ type: String , required: true},
  booking: { type: Boolean, default : false }
});

const Bad = new mongoose.model("Bad", badSchema);
module.exports = Bad;
