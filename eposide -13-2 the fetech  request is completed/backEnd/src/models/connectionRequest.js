const mongoose= require("mongoose");

const connectionRequestSchema = new mongoose.Schema({
    fromUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    toUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    status:{
        type:String,
        required:true,
        enum:{
            values:["ignore","interested","accepted","rejected"],
            message:`{VALUE} is incorrect status type`
        }
    }
},{
    timestamps:true
})

// compoundIndex make query very very fast to search any things 
//ex-1 -> connectionRequestSchema.index({fromUserId:any Id,toUserId:any id })
// if we put compund index query then our query is very very fast even in the million of data




connectionRequestSchema.index({fromUserId:1,toUserId:1})
// the pre method called just before the save method is called  
connectionRequestSchema.pre("save",function(next){
const connectionReqest = this ;
// Check if the fromUserId is same as toUserId
if(connectionReqest.fromUserId.equals(connectionReqest.toUserId)){
    throw new Error("Cannot send connection request to yourself! ");
}
next();
})

const connectionRequestModel = new mongoose.model("connectionRequestModel",
    connectionRequestSchema
)

module.exports= connectionRequestModel;