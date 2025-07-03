const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt= require("jsonwebtoken")
const userSchema = new mongoose.Schema(
  {
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
      enum:{
        values:["male","female","others"],
        message:`{VALUE} is not valid gender type`
      },
      // validate(value) {
      //   if (!["male", "female", "others"].includes(value.toLowerCase())) {
      //     throw new Error("Gender data is not valid");
      //   }
      // },
    },
    skills: {
      type: [String],
    },
    photoUrl: {
      type: String,
      default:
        "https://weimaracademy.org/wp-content/uploads/2021/08/dummy-user.png",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Plase enter a valid Url");
        }
      },
    },
    about: {
      type: String,
      default: "This is default about of the user",
    },
  },
  {
    timestamps: true,
  }
);




// suppose we want to search a user using firstName and lastName then we put the compound index on the firstName and lastName 
 userSchema.index({firstName:1,lastName:1})
userSchema.methods.getJwt = async function () {
  const user = this;

  const token = await jwt.sign({ _id: user._id }, "DEV@Tinder$790", {
    expiresIn: "7d",
  });
  return token
};

userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;
  const passwordHash = user.password;
  const ispasswordValid = await bcrypt.compare(
    passwordInputByUser,
    passwordHash
  );

  return ispasswordValid;
};

// Correct model creation
const User = mongoose.model("User", userSchema);

module.exports = User;
