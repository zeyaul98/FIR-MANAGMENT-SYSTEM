const mongoose = require("mongoose");

const bailerSchema = new mongoose.Schema(
  {
    officerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    firId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FIR",
      required: true,
    },

    bailDate: {
      type: Date,
      default: null,
    },

    name: {
      type: String,
      default: "",
      trim: true,
    },

    aadhaar: {
      type: String,
      default: "",
      trim: true,
    },

    gender: {
      type: String,
      enum: ["male", "female", "other", ""],
      default: "male",
    },

    dob: {
      type: Date,
      default: null,
    },

    age: {
      type: Number,
      default: null,
    },

    fatherName: {
      type: String,
      default: "",
    },

    relationWithAccused: {
      type: String,
      default: "",
    },

    railPoliceStation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Thana",
      default: null,
    },

    bailCourt: {
      type: String,
      default: "",
    },

    state: {
      type: String,
      default: "",
    },

    districtId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "District",
      default: null,
    },

    address: {
      type: String,
      default: "",
    },

    pinCode: {
      type: String,
      default: "",
    },

    mobile: {
      type: String,
      default: "",
    },

    securityAmount: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["active", "expired"],
      default: "active",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Bailer", bailerSchema);