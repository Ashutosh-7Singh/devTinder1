const express = require("express");
const connectDb = require("./config/database");
const app = express();
const User = require("./models/User");
const bcrypt = require("bcrypt");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const validateSignupData = require("./utils/validation");

app.use(express.json());
app.use(cookieParser());


app.post("/signup", async (req, res) => {
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

app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    if (!validator.isEmail(emailId)) {
      return res.status(404).send("Invalid Email in login");
    }

    const user = await User.findOne({ emailId: emailId });

    if (!user) {
      return res.status(404).send("Invalid Crendtials");
    }

    const ispasswordValid = await bcrypt.compare(password, user.password);
    if (ispasswordValid) {
      // create a JWT token
      const token = await jwt.sign({ _id:user._id }, "DEV@Tinder$790");

      // Add the token to cookie and send the response back to the user
      res.cookie("token", token);
      res.status(200).send("Login sucessfull");
    } else {
      return res.status(404).send("Invalid Crendential Pass");
    }
  } catch (error) {
    res.status(500).send("Something Went wrong" + error.message);
  }
});

app.get("/profile", async (req, res) => {
 try{
   const cookies= req.cookies;
  const {token}=cookies;

  if(!token){
    throw new Error("Invlaid Token")
  }
  // validaate my token 
  const decoadedMessage = await jwt.verify(token,"DEV@Tinder$790")

  const {_id}=decoadedMessage
   console.log("Logged in user is :-  " + _id);
   const user = await User.findById(_id);
   if(!user){
    throw new Error("User does not exist");
   }
   res.send(user)
 }catch(error){
  res.status(500).send("something went wrong"  + error.message)
 }
  
});






app.get("/user", async (req, res) => {
  try {
    const userEmail = req.body.emailId;

    const users = await User.findOne({ emailId: userEmail });
    if (!users) {
      return res.status(404).send("user not found");
    }
    res.send(users);
  } catch (error) {
    res.status(400).send("some thing went wrong");
  }
});

app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({
      message: "User deleted successfully",
      deletedUser: user,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
});

// app.delete("/user" ,async (req,res)=>{
//   const userId=req.body.userId
//   try{
//     const user = await  User.findByIdAndDelete({_id:userId})
//     res.status(200).send("user deleted Sucessful",user)
//   }catch(error){
//     res.status(500).send("something went wrong" + error.message)
//   }
// })

app.delete("/userEmail", async (req, res) => {
  const userEmail = req.body.emailId;
  try {
    const user = await User.findOneAndDelete({ emailId: userEmail });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({
      message: "User deleted successfully",
      deletedUser: user,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
});

// app.delete("/userEmail",async (req,res)=>{
//   const userEmail=req.body.emailId

//   try{

//     const user=await User.findOneAndDelete({emailId:userEmail},{returnDocument:"after"})
//     res.status(200).send("user Deleted Succesffully" , user)
//   }catch(error){
//     res.status(500).send("Something went wrong" + error.message)
//   }
// })

app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;
  try {
    const ALLOWED_UDATES = [
      "photoUrl",
      "about",
      "skills",
      "gender",
      "age",
      "firstName",
      "lastName",
    ];

    const isUpdateAllowed = Object.keys(data).every((k) =>
      ALLOWED_UDATES.includes(k)
    );
    if (!isUpdateAllowed) {
      return res.status(400).send("update not allowed");
    }
    if (data?.skills.length > 10) {
      return res.status(400).send("skill length not more than 10");
    }

    const user = await User.findByIdAndUpdate(userId, data, {
      new: true,
      runValidators: true, // THIS is the correct way to get updated doc
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({
      message: "User updated successfully",
      updatedUser: user,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
});

// app.patch("/user",async (req,res)=>{
//   const userId=req.body.userId
//   const data=req.body
//   try{
//     const user= await User.findByIdAndUpdate({_id:userId},data,{
//       returnDocument:"after"
//     })

//     res.status(200).send("userUpdated Sucessfully",user)
//   }catch(error){
//     res.status(500).send("some thing went wrong" + error.message)
//   }
// })

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
