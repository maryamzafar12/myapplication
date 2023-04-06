let mongoose=require("mongoose");
module.exports=mongoose.model("Product",{
    title:String,
    price:String,
    id:String,
    description:String,
    img:String,
    apple:String,
    productType:String,
    color:[],
    size:[],
    // customerselectedcolor:String,
    // customerselectedsize:String,
});