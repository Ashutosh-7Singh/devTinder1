const express = require("express");
const userAuth = require("../midlewares/auth");
const ConnectionRequestModel = require("../models/connectionRequest");
const userRouter = express.Router();


// get All the pending connectionRequest for the logged in user
userRouter.get("/user/requests/recieved", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const connectionRequest = await ConnectionRequestModel.find({
            toUserId: loggedInUser._id,
            status: "interested"
        }).populate("fromUserId","firstName lastName")

        
        // .populate("fromUserId",["firstName","lastName"])


        // console.log("connectionRequest", connectionRequest);
        res.json({
            message: "Data fetched successfully",
            data: connectionRequest,
        })
    } catch (error) {
        res.status(400).send("Error :- " + error.message)
    }
})

module.exports = userRouter;