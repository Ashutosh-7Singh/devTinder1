const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    minLength: 4,
    required: true,
  },
  lastName: {
    type: String,
  },
  emailId: {
    type: String,
    lowercase: true,
    trim: true,
    required: true,
    unique: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Invalid Email");
      }
    },
  },
  password: {
    type: String,
    trim: true,
    required: true,
    validate(value) {
      if (!validator.isStrongPassword(value)) {
        throw new Error("Password is not Strong");
      }
    },
  },
  age: {
    type: Number,
    trim: true,
    min: 18,
  },
  gender: {
    type: String,
    trim: true,
    validate(value) {
      if (!["male", "female", "others"].includes(value.toLowerCase())) {
        throw new Error("Gender data is not valid");
      }
    },
  },
  skills: {
    type: [String],
  },
  photoUrl: {
    type: String,
    default: "https://weimaracademy.org/wp-content/uploads/2021/08/dummy-user.png",
  },
  about: {
    type: String,
    default: "This is default about of the user",
  },
});

// Correct model creation
const User = mongoose.model("User", userSchema);

module.exports = User;
