let mongoose=require("mongoose");
module.exports=mongoose.model("user",{
    name:String,
    password:String,
    id:String,
    email:String,
   
})