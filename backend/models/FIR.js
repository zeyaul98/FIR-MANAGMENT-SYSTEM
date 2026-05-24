const mongoose = require("mongoose");

const firSchema = new mongoose.Schema(
  {
    firNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    accusedType: {
      type: String,
      default: "",
    },

    state: {
      type: String,
      default: "",
    },

    zone: {
      type: String,
      default: "",
    },

    subDivision: {
      type: String,
      default: "",
    },

    circleOffice: {
      type: String,
      default: "",
    },

    court: {
      type: String,
      default: "",
    },

    sections: {
      type: String,
      default: "",
    },

    year: {
      type: Number,
      default: null,
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

    incidentTime: {
      type: String,
      default: "",
    },

    modusOperandi: {
      type: String,
      default: "",
    },

    itemLooted: {
      type: String,
      default: "",
    },

    trainNo: {
      type: String,
      default: "",
    },

    trainName: {
      type: String,
      default: "",
    },

    stationCode: {
      type: String,
      default: "",
    },

    stationName: {
      type: String,
      default: "",
    },

    platformNo: {
      type: String,
      default: "",
    },

    ioDetails: {
      ioName: { type: String, default: "" },
      beltNo: { type: String, default: "" },
      rank: { type: String, default: "" },
      ioMobile: { type: String, default: "" },
    },

    lawyerDetails: {
      lawyerName: { type: String, default: "" },
      barCouncilNo: { type: String, default: "" },
      lawyerMobile: { type: String, default: "" },
      lawyerEmail: { type: String, default: "" },
    },

    attachment: {
      type: String,
      default: "",
    },

    accused: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Accused",
      },
    ],

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

    officerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("FIR", firSchema);