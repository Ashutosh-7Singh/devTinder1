const express = require("express");
const connectDb = require("./config/database");
const app = express();
const User = require("./models/User");

const authRouter = require("./routes/auth")
const profileRouter=require("./routes/profile")
const connectionRequest=require("./routes/request");
const userRouter = require("./routes/user");





app.use("/",authRouter)
app.use("/",profileRouter)
app.use("/",connectionRequest)
app.use("/",userRouter)








connectDb()
  .then(() => {
    console.log("Database connected successfully");
    app.listen(1212, () => {
      console.log("Server is running on port 1212");
    });
  })
  .catch((error) => {
    console.log("Database not connected", error.message);
  });