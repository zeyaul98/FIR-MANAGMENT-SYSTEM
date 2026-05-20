const mongoose = require("mongoose");

const thanaSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  districtId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "District",
    required: true,
  },
  area: {
    type: String,
    required: true,
  },
  totalFIRs: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

module.exports = mongoose.model("Thana", thanaSchema);
