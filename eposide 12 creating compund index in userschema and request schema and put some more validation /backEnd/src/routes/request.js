const express = require("express");
const userAuth = require("../midlewares/auth");
const connectionRequest = require("../models/connectionRequest");
const User = require("../models/User");

const requestRouter = express.Router()


requestRouter.post("/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status
      const allowedStatus = ["ignored", "interested"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({
          message: "Invalid Status Type - " +
            status
        })
      }
      // find toUser Existing or not beofore sending the request 

      const toUser = await User.findById(toUserId)

        if(!toUser){
          return res.status(404).json({message:"User not found "})
        }
      
        


      // If there is an existing ConnectionRequest 
      const existingConnectionRequest = await connectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId }
        ]
      })

      if (existingConnectionRequest) {
        return res.status(400).json({ message: "Connection Request Already EXists !!  " })
      }

      const connectionReqest = new connectionRequest({
        fromUserId,
        toUserId,
        status
      })
      const data = await connectionReqest.save();
      res.status(201).json({
        message: req.user.firstName + " is " + status + " in " + toUser.firstName ,
         data

      });

    } catch (error) {
      res.status(500).json({
        message: "Some thing went wrong",
        Error: error.message
      })
    }
  })

module.exports = requestRouter;