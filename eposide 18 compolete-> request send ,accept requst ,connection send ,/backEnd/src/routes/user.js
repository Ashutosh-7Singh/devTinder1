const express = require("express");
const userAuth = require("../midlewares/auth");
const ConnectionRequestModel = require("../models/connectionRequest");
const User = require("../models/User");
const userRouter = express.Router();


const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills";

// get All the pending connectionRequest for the logged in user
userRouter.get("/user/requests/recieved", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const connectionRequest = await ConnectionRequestModel.find({
            toUserId: loggedInUser._id,
            status: "interested"
        }).populate("fromUserId")


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


userRouter.get("/user/connection",
    userAuth, async (req, res) => {
        // elon =>akshay=>Accepted
        // mark=>elon=>accepted

        try {

            const loggedInUser = req.user;
            const connectionReqest = await ConnectionRequestModel.find({
                $or: [
                    { toUserId: loggedInUser._id, status: "accepted" },
                    { fromUserId: loggedInUser._id, status: "accepted" }
                ]
            }).populate("fromUserId", USER_SAFE_DATA)
                .populate("toUserId", USER_SAFE_DATA)

            const data = connectionReqest.map((row) => {
                if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
                    return row.toUserId;
                }
                return row.fromUserId
            })
            // row.fromUserId);


            res.json({
                message: "Coneccction found Sucessfull",
                Data: data
            })

        } catch (error) {
            res.status(400).send("Error - " + error.message)
        }
    }
)

userRouter.get("/feed", userAuth, async (req, res) => {
    try {
        // User should see all the other user card 
        // 0.his own card
        // 1.accepted
        // 2.already send connection request
        //  3.ignored card
        const loggedInUser = req.user
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit= limit > 50 ? 50 :limit; 
        const skip= (page-1)*limit
    
        // find all the connection request that is sent or recieved 
        const connectionReqest = await ConnectionRequestModel.find({
            $or: [
                { fromUserId: loggedInUser._id }, { toUserId: loggedInUser.id }
            ]
        })
            .select("fromUserId  toUserId")
        // .populate("fromUserId","firstName")
        // .populate("toUserId", "firstName")
        const hideUserFromFeed = new Set();
        connectionReqest.forEach(req => {
            hideUserFromFeed.add(req.fromUserId.toString());
            hideUserFromFeed.add(req.toUserId.toString())
        })
        console.log(hideUserFromFeed);

        const users = await User.find({
            $and:
                [
                    { _id: { $nin: Array.from(hideUserFromFeed) } }
                    ,
                    { _id: { $ne: loggedInUser._id } }
                ]
        }).select(USER_SAFE_DATA).skip(skip).limit(limit);


        res.send(users)
    } catch (error) {
        res.status(400).send({ message: "Something went wrong", Error: error.message })
    }
})
module.exports = userRouter;