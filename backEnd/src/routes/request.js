const express = require("express");
const userAuth = require("../midlewares/auth");
const connectionRequestModel = require("../models/connectionRequest");

const requestRouter= express.Router()


requestRouter.post("/request/send/:status/:toUserId", 
  userAuth ,
   async (req,res)=>{
  try{
    const fromUserId = req.user._id;
    const toUserId=req.params.toUserId;
    const status=req.params.status
const connectionReqest=new connectionRequestModel({
      fromUserId,
      toUserId,
      status
})
const data=await connectionReqest.save();
res.status(201).json({
  message:"Connection Request Sent Successfully ! " ,data

});

}catch(error){
res.status(500).json({message:"Some thing went wrong" ,
  Error: error.message})
  }
})

module.exports=requestRouter;