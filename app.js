let myExpress = require("express");
let cors = require("cors");
const stripe = require("stripe")("sk_test_51MHMW2CqCtR8SSh8B97jc9Vzsvq8csrYC4JDSJc40PfxnW9N4FsndTxLxGTwUUGgay5CDn4jW9RwWqjKRPrS0ryo00ufa1d3Zd");
let User = require("./models/user");
let product = require("./models/Product");
let Orders = require("./models/CustomerOrders");
const path=require("path");

const { v4: uuidv4, stringify } = require('uuid');
 let jsonwebtoken=require('jsonwebtoken');
let app = myExpress();
app.use(cors());
app.use(myExpress.json());
var cloudinary = require('cloudinary').v2;
const fileUpload = require('express-fileupload');



cloudinary.config({
  cloud_name: 'divt0l8gs',
  api_key: '488194229687522',
  api_secret: 'uhPKAe7GESCDr_HPx5cgsKLB0b4',
  secure: true
});

let mongoose = require("mongoose");
const { CollectionsOutlined } = require("@mui/icons-material");
mongoose.connect("mongodb+srv://maryamkhankk:N0taOskb7tpPm8oe@shoesclustor.jmeshjg.mongodb.net/shoesStore?retryWrites=true&w=majority", (err, conn) => {
    console.log(err || conn)
});

app.use(fileUpload({
  useTempFiles: true
}));
app.post("/Signup", (incoming, outgoing) => {
  let nyaUser = new User(incoming.body);
  nyaUser.save();
});

app.get("/adminpannel", async (incoming, outgoing) => {
  await User.find().then((abc) => {
    outgoing.json(abc);
  });
});
// console.log(newuser);
  

//  ye dya ka login wala code hai 

app.post('/login', async(incoming, outgoing) => {
  //  console.log(incoming.body);
  let currentuser = await User.findOne(incoming.body);
  // console.log(currentuser);
  if (currentuser) {
      jsonwebtoken.sign({ id: currentuser._id }, "cat says miooon in FSD", {
          expiresIn: "1d"
      }, function (err, hmaratoken) {

          outgoing.json({
            currentuser,
           token:hmaratoken
          });
      })
  }
});
app.get("/api", (incoming, outgoing) => {
  outgoing.json(Api)

});

app.post("/loginId", async(incoming, outgoing) => {
console.log(incoming.body.LoginId);

 let id=await User.findById(incoming.body.LoginId);
outgoing.json({
    success:true,
    id:id
})
});



// this is for checkout method

app.post("/checkout", async (incoming, outgoing) => {
  let error;
  let status;
  console.log(incoming.body.qty)
  try {
    const { product, token } = incoming.body;
     console.log(incoming.body.product.shoppingcart);
    const customer = await stripe.customers.create({
      email: token.email,
      source: token.id
    });

   
    
    const key = uuidv4();
    const charge = await stripe.charges.create(
     
      {
        amount: product.price,
        currency: "usd",
        customer: customer.id,
        receipt_email: token.email,
        description: "All Product Description",
        shipping: {
          name: token.card.name,
          address: {
            line1: token.card.address_line1,
            line2: token.card.address_line2,
            city: token.card.address_city,
            country: token.card.address_country,
            postal_code: token.card.address_zip,
          }
        }
      },
   
      {
        idempotencyKey: key

      }
      )
     
    status = "success"
    let qty=incoming.body.qty;
    let a=incoming.body.product.shoppingcart;
    console.log( incoming.body.product.shoppingcart);
    let order= new  Orders(charge);
    order.shoppingcart=a;
    order.qty=qty;
    // order.carts.push(incoming.body.product.shoppingcart);
    order.save();
  }
  catch (error) {
    console.log(error);
    status = "error"
  }
  outgoing.json({ status })
});
// ye data base se jo adimin ek ek kr k product baj raah hai wo  hmm ne db se uthai hai 


app.get("/productadwali", async (incoming, outgoing) => {
  await product.find().then((abc) => {
    outgoing.json(abc);
  });
});
app.post("/productdata", async (incoming, outgoing) => {
  console.log(incoming.body);
  let id = incoming.body.pd;
  console.log(id);
  app.put("/product-editform", async (incoming, outgoing) => {
    console.log(incoming.body)
    let updatehugai= await product.findByIdAndUpdate(id, {
      price: incoming.body.price,
      title: incoming.body.title,
      description: incoming.body.description,
      productType: incoming.body.productType,
      img: incoming.body.myFile
    });

    //  dashboard ko apny ap udate bi kry edit k baad us k leye ha
  
    outgoing.json({
      success: true,
    
    });
    
console.log(updatehugai);

  });
  await product.findById(id).then((abc) => {
    outgoing.json(abc._doc);
    console.log(abc._doc);
  });
});


app.get("/productdashboard", async (incoming, outgoing) => {
  await product.find().then((abc) => {
    outgoing.json(abc);
  });
});

 
app.post("/product", async (incoming, outgoing) => {
  console.log(incoming.body);

  try {
    console.log(incoming.body);
    
    console.log(incoming.files.myFile.tempFilePath);
    const file = incoming.files.myFile.tempFilePath;
    cloudinary.uploader.upload(file, (error, result) => {
      console.log(result);
      let products = new product(incoming.body);
      let imgs = result.url;
      console.log(imgs);
      products.img = imgs
       
       
      products.size.push(incoming.body.small);
      products.size.push(incoming.body.medium);
      products.size.push(incoming.body.large);
      products.size.push(incoming.body.extrasmall);
      products.size.push(incoming.body.extralarge);
      products.color.push(incoming.body.red);
      products.color.push(incoming.body.gray);
      products.color.push(incoming.body.black);

      products.save();
      outgoing.json({
        products :products 
    })
     
    });
   
  }
  catch (e) {
    outgoing.status(403).json({
      message: "AGE IS REQUIERED"
    })
    console.log(e)
  }



});


app.delete('/user-delete', async(incoming, outgoing)=>{

  await product.findByIdAndDelete(incoming.query.id);
  outgoing.json({
      success:true
  })

  console.log(incoming.query.id);


})
app.get("/productdetailpage",async(incoming,outgoing)=>{
 let productid =await product.findById(incoming.query.id);
  outgoing.json({
      success:true,
      id:productid
  });
  console.log(incoming.query.id);                          
   console.log(productid);
});
// ye wala route hmara shopping cart jo customer order hai us ne kitni li hai wo hai 

app.post("/CustomerOrder",async(incoming,outgoing)=>{
      console.log(incoming.body);
  console.log(incoming.body);
  let id = incoming.body.order;
  console.log(id);
  let customerid= await Orders.findById(id);
 console.log(customerid);
   outgoing.json({
       success:true,
       id:customerid
   });
 });
 
 app.delete('/customeershopping', async(incoming, outgoing)=>{  
  await  Orders.findByIdAndDelete(incoming.query.id);
  outgoing.json({
      success:true
  })
  console.log(incoming.query.id);
})

app.get("/orderdetails", async (incoming, outgoing) => {
  await Orders.find().then((abc) => {
    outgoing.json(abc);
  });
});

// servering frontend only build 
app.use(myExpress.static(path.join(__dirname,"build")))
app.get("*",(req,res)=>{
res.sendFile(
  path.join(__dirname,"build/index.html"),
  function (err){
 res.status(500).send(err)
  }

)

});

app.listen(  process.env.port || 4343, () => {
  console.log("server is chaling")
});
