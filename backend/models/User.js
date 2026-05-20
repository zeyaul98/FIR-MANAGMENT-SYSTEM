const mongoose = require("mongoose");

let bcrypt;
try {
  bcrypt = require("bcryptjs");
} catch (err) {
  console.warn("bcryptjs not installed - using plain text passwords (NOT SECURE)");
  bcrypt = null;
}

const userSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true,
  },

  username: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  role: {
    type: String,
    enum: ["admin", "officer"],
    required: true,
  },

}, { timestamps: true });

userSchema.pre("save", async function(next) {
  if (!this.isModified("password")) {
    return next();
  }

  if (!bcrypt) {
    console.warn("⚠️  WARNING: Password saved as plain text - install bcryptjs!");
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.comparePassword = async function(enteredPassword) {
  if (!bcrypt) {
    return enteredPassword === this.password;
  }
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model(
  "User",
  userSchema
);