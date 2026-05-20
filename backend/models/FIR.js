const mongoose = require("mongoose");

const firSchema = new mongoose.Schema({
  firNumber: {
    type: String,
    required: true,
    unique: true,
  },
  districtId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "District",
    required: true,
  },
  thanaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Thana",
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["registered", "investigation", "closed"],
    default: "registered",
  },
  dateOfIncident: {
    type: Date,
    required: true,
  },
  dateOfRegistration: {
    type: Date,
    default: Date.now,
  },
  accused: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Accused",
  }],
  totalAccused: {
    type: Number,
    default: 0,
  },
  bailed: {
    type: Number,
    default: 0,
  },
  inCustody: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

module.exports = mongoose.model("FIR", firSchema);
