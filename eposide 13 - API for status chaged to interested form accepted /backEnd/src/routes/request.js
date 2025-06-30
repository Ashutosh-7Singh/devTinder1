const express = require("express");
const userAuth = require("../midlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
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

      if (!toUser) {
        return res.status(404).json({ message: "User not found " })
      }




      // If there is an existing ConnectionRequest 
      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId }
        ]
      })

      if (existingConnectionRequest) {
        return res.status(400).json({ message: "Connection Request Already EXists !!  " })
      }

      const connectionReqest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status
      })
      const data = await connectionReqest.save();
      res.status(201).json({
        message: req.user.firstName + " is " + status + " in " + toUser.firstName,
        data

      });

    } catch (error) {
      res.status(500).json({
        message: "Some thing went wrong",
        Error: error.message
      })
    }
  })

requestRouter.post("/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;
      console.log(req.params);
      console.log(loggedInUser._id);

      const allowedStatus = ["accepted", "rejected"];

      if (!allowedStatus.includes(status)) {
        return res.status(400).json({ message: "Status not allowed" })
      }
      // now we fined the toUser should be loogedIN user and the status should be interested and user should be paresent in the db

      const connectionReqest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });
      console.log("connectionReqest", connectionReqest);

      if (!connectionReqest) {
        return res.status(404).json({ message: "No matching request found" });
      }


      connectionReqest.status = status;
      const data = await connectionReqest.save();
      res.json({ message: " Connection request " + status, data })



      // Elon ---send--> Akshay
      // loggedIn user should be only =>toUserId
      // status= intrested
      // request Id should be valid 


    } catch (error) {
      res.status(400).send("ERROR: " + error.message)
    }
  })



module.exports = requestRouter;