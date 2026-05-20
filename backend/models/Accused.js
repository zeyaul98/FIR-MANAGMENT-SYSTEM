const mongoose = require("mongoose");

const accusedSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  gender: {
    type: String,
    enum: ["male", "female", "other"],
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["arrested", "bail", "under-trial"],
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
}, { timestamps: true });

module.exports = mongoose.model("Accused", accusedSchema);
