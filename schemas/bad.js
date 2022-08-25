require("dotenv").config();
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const badSchema = new Schema({
  hospitalId: { type: Schema.Types.ObjectId, ref: "Hospital" },
  generalType : { 
  type: { type: String , default : "General"},
  availbility : { type: Number, required: true, default: 0 },
  pricePerbad: { type: Number, required: true }
  },
  specialType : { 
  type: { type: String , default : "Special"},
  availbility : { type: Number, required: true, default: 0  },
  pricePerbad: { type: Number, required: true }
  },
  otherFacilities:{ type: String , required: true},
});

const Bad = new mongoose.model("Bad", badSchema);
module.exports = Bad;
