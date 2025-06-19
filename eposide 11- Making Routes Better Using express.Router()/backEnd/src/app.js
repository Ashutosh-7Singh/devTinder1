const express = require("express");
const connectDb = require("./config/database");
const app = express();
const User = require("./models/User");

const authRouter = require("./routes/auth")
const profileRouter=require("./routes/profile")
const connectionRequest=require("./routes/request")





app.use("/",authRouter)
app.use("/",profileRouter)
app.use("/",connectionRequest)




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
