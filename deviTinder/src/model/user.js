const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    trim: true,
    required: true,
    minLength: 4,
  },
  lastName: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
    required: true,
    lowercase: true,
    unique: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Invalid Email");
      }
    },
  },
  password: {
    type: String,
    required: true,
    trim: true,
    validate(value) {
      if (!validator.isStrongPassword(value)) {
        throw new Error("Password not strong");
      }
    },
  },
   age: {
      type: Number,
      max: 18,
      trim: true,
    },
    gender: {
      trim: true,
      type: String,
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("Gender data is not valid");
        }
      },
    },
    about: {
      type: String,
      default: "this is default about",
    },
    skills: {
      type: [String],
    },
    photoUrl: {
      type: String,
      default: "https://avatars.githubusercontent.com/u/7790161?v=4",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid Proto URL: " + value);
        }
      },
    },



});

// Exclude sensitive fields from JSON output
userSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.password;
    delete ret._id;
    delete ret.email;
    delete ret.__v;
    return ret;
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
