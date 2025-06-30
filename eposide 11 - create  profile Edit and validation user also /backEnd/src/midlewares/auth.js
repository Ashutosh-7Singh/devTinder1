const jwt = require("jsonwebtoken");
const User = require("../models/User");

const userAuth = async (req, res, next) => {
  try {
    // read the token from the req cookies
    const { token } = req.cookies;
    if (!token) {
      throw new Error("Token is not valid !!!! ");
    }
    const decodeObj = await jwt.verify(token, "DEV@Tinder$790");
    const { _id } = decodeObj;
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User does not exist");
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(400).send("Some thing went worng:- " + error.message);
  }
};
module.exports = userAuth;
