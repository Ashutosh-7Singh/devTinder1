const express = require("express");
const userAuth = require("../midlewares/auth");

const requestRouter= express.Router()


requestRouter.post("/sendingConnectionRequest", userAuth , async (req,res)=>{
  const user = req.user;

  // sending a connection request

  console.log("Sending a conenction request ");

  res.send(user.firstName + " Sent the conection request !")
})

module.exports=requestRouter;