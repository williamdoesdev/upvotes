const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    maxlength: 255,
    required: true,
  },
  email: {
    type: String,
    maxlength: 255,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    maxlength: 2024,
    required: true,
  },
  isAdmin: Boolean,
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, isAdmin: this.isAdmin },
    process.env.JWT_PRIVATE_KEY
  );
  return token;
};

userSchema.methods.decodeAuthToken = function (token) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
    return decoded;
  } catch (err) {
    return null;
  }
};

module.exports = mongoose.model("User", userSchema);
