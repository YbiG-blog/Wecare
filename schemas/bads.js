require("dotenv").config();
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const badSchema = new Schema({
  hospitalId: { type: Schema.Types.ObjectId, ref: "Hospital" },
  roomNum: { type: Number, required: true },
  // badsInroom: { type: Number, required: true },
  price: { type: Number, required: true },
  description:{ type: String , default: "Nice Bad"},
  booking: { type: Boolean, default : false }
});

const Bad = new mongoose.model("Bad", badSchema);
module.exports = Bad;
