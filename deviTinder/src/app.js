const express = require("express");
const connectDb = require("./config/database");
const cookieParser = require("cookie-parser");
const validateSignupData = require("./utils/validation");
const bcrypt = require("bcrypt");
const User = require("./model/user.js");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const app = express();

app.use(express.json());
app.use(cookieParser()); // ✅ fixed: call the function

app.post("/signup", async (req, res) => {
  try {
    // ✅ Validate input
    const validationResult = validateSignupData(req);

    if (!validationResult.success) {
      return res.status(400).json(validationResult);
    }

    const { firstName, lastName, email, password } = req.body;

    // ✅ Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // ✅ Save user
    const userInfo = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
    });

    const user = await userInfo.save();

    res
      .status(201)
      .json({ success: true, message: "User saved successfully", user });
  } catch (error) {
    // ✅ Error fallback
    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ sucess: false, message: "Body  is invalid" });
    }
    if (!validator.isEmail(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email format" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    };

    const token = jwt.sign({ _id: user._id }, "DEV@Tinder$7890");

    return res
      .cookie("token", token, {
        httpOnly: true,
        secure: false, // Set to true in production
        sameSite: "strict",
      })
      .status(200)
      .json({ success: true, message: "Login successful", user });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
});

app.get("profile", async (req, res) => {
  try {
    const cookies = req.cookies;
    const { token } = cookies;
    if (!token) {
      return res.status(400).json({ status: false, message: "Invalid Token" });
    }

    // validate my token
    const decoadedMessage = await jwt.verify(token, "DEV@Tinder$7890");

    const { _id } = decoadedMessage;

    const user = await User.findById(_id);
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid User" });
    }
    res.json({ sucess: true, message: "User Found Sucessfully", user });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Something Went Wrong",
    });
  }
});




// ✅ DB and server connection
connectDb()
  .then(() => {
    console.log("Database connected successfully");
    app.listen(1111, () => {
      console.log("Server successfully running on port 1111");
    });
  })
  .catch((error) => {
    console.log("Database not connected", error.message);
  });
