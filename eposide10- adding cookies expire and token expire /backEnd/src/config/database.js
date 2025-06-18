const mongoose=require("mongoose");;

const connectbDb=async()=>{
    await mongoose.connect("mongodb://localhost:27017/devBaba")
}



module.exports=connectbDb;