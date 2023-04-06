let mongoose=require("mongoose");
module.exports=mongoose.model("CustomerOrders",{
    amount:Number,
    currency:String,
    customer:String,
    receipt_email:String,
    description:String,
    shoppingcart:[],
    qty:String,
    shipping: {
        name: String,
        address: {
          line1: String,
          line2: String,
          city:String,
          country:String,
          postal_code: String,
        }
      }
});



