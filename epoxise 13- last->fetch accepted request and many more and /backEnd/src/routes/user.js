const express = require("express");
const userAuth = require("../midlewares/auth");
const ConnectionRequestModel = require("../models/connectionRequest");
const userRouter = express.Router();


const USER_SAFE_DATA="firstName lastName photoUrl age gender about skills";

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


userRouter.get("/user/connection",
    userAuth,async(req,res)=>{
        // elon =>akshay=>Accepted
        // mark=>elon=>accepted

        try{

            const loggedInUser=req.user;
            const connectionReqest= await ConnectionRequestModel.find({
                $or:[
                    {toUserId:loggedInUser._id,status:"accepted"},
                    {fromUserId:loggedInUser._id,status:"accepted"}
                ]
            }).populate("fromUserId",USER_SAFE_DATA)
            .populate("toUserId",USER_SAFE_DATA)

            const data=connectionReqest.map((row)=>
                
                {
                    if(row.fromUserId._id.toString() ===loggedInUser._id.toString()){
                     return row.toUserId;
                    }
                    return row.fromUserId
                })
                // row.fromUserId);


            res.json({message:"Coneccction found Sucessfull" ,
                Data:data
            })

        }catch(error){
            res.status(400).send("Error - " + error.message)
        }
    }
)
module.exports = userRouter;