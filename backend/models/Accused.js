const mongoose = require("mongoose");

const accusedSchema = new mongoose.Schema(
  {
    firId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FIR",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    fatherName: {
      type: String,
      trim: true,
      default: "",
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

    mobile: {
      type: String,
      trim: true,
      default: "",
    },

    aadhaar: {
      type: String,
      trim: true,
      default: "",
    },

    address: {
      type: String,
      required: true,
      trim: true,
    },

    districtId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "District",
      default: null,
    },

    thanaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Thana",
      default: null,
    },

    sections: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: [
        "arrested",
        "bail",
        "under-trial",
        "judicial-custody",
        "absconding",
        "other",
      ],
      required: true,
      default: "other",
    },

    isAbsconding: {
      type: Boolean,
      default: false,
    },

    bailDate: {
      type: Date,
      default: null,
    },

    remarks: {
      type: String,
      default: "",
    },
    dob: {
  type: Date,
  default: null,
      },

      markIdentification: {
        type: String,
        default: "",
      },

      built: {
        type: String,
        default: "",
      },

      relationWithBailer: {
        type: String,
        default: "",
      },

      policeStation: {
        type: String,
        default: "",
      },

      state: {
        type: String,
        default: "",
      },

      pinCode: {
        type: String,
        default: "",
      },

      isJailCustody: {
        type: Boolean,
        default: false,
      },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Accused", accusedSchema);