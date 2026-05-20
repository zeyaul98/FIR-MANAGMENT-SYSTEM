const mongoose = require("mongoose");

const districtSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  region: {
    type: String,
    required: true,
  },
  totalThanas: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

module.exports = mongoose.model("District", districtSchema);
