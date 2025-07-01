const express = require("express");
const {validateSignupData} = require("../utils/validation");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const authRouter = express.Router();

authRouter.use(cookieParser());
authRouter.use(express.json());

authRouter.post("/signup", async (req, res) => {
  try {
    // validate SignUp data
    validateSignupData(req);
    const { firstName, lastName, emailId, password } = req.body;

    // Encrypt the password
    const passwordHash = await bcrypt.hash(password, 10);
    // console.log(passwordHash);
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });

    await user.save();

    res.status(201).json({ message: "User added successfully", user });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Something went wrong", error: error.message });
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    if (!validator.isEmail(emailId)) {
      return res.status(400).send("Invalid Email in login");
    }

    const user = await User.findOne({ emailId });
    if (!user) {
      return res.status(404).send("Invalid Credentials");
    }

    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      return res.status(401).send("Invalid Credential Pass");
    }

    const token = await user.getJwt(); // ✅ FIXED: Call method

    // ✅ FIXED: Set cookie correctly
    res.cookie("token", token, {
      httpOnly: true,
      expires: new Date(Date.now() + 8 * 3600000), // 8 hours
    });

    res.status(200).send("Login successful");
  } catch (error) {
    res.status(500).send("Something went wrong: " + error.message);
  }
});


authRouter.post("/logout",async(req,res)=>{
  res.cookie("token",null ,{
    expires:new Date(Date.now()),
  })
  res.send("Logout successfully");
})


module.exports = authRouter;
