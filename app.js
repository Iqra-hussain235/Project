const express =require("express");
const app=express();
const mongoose =require("mongoose");
const path=require("path");
const methodOverride = require("method-override");
const ejsMate =require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session =require("express-session");
const flash= require("connect-flash");


const listings=require("./routes/listing.js");
const reviews=require("./routes/review.js");



app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const MONGO_URL ="mongodb://127.0.0.1:27017/wanderlust";

main()
    .then(()=>{
       console.log("connect to DB");
    })
    .catch((err)=>{
        console.log(err);
    });

async function main() {
      await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static('public'));

const sessionOptions={
  secret:"mysupersecretcode",
  resave:false,
  saveUninitialized:true,
  cookie:{
    expires:Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly:true,
  },
};

app.get("/",(req,res)=>{
   res.send("succesfullt");
});
app.use(session(sessionOptions));
app.use(flash());


app.use((req,res,next)=>{
  res.locals.success = req.flash("success");
    next();
})









// });

app.use("/listings",listings);
app.use("/listings/:id/review",reviews);






app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).render("error.ejs",{message});
  // res.status(statusCode).send(message);
});
//wraperror handle



app.listen(8080,()=>{
  console.log("server is listening to port 8080");
});






// app.get("/testListing",async (req,res)=>{
//     let sampleListing =new Listing({
//         title:"My New Villa",
//         description:"By the Beach",
//         price:1200,
//         location:"Calangute,Goa",
//         country:"India",
//     });
//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("successful testing");
// });






// Create route
// app.post("/listings",async (req,res)=>{

// let {title, description, price, image, country, location}=req.body;
// app.use((err,req,res,next)=>{
  //   let {statusCode=500,message="something wronge"}=err;
  //   res.status(statusCode).send(message);
  //   res.send("somethiing went wronge");
  // });
  
  
  // app.all("*", (req, res, next) => {
  //   next(new ExpressError(404, "Page Not Found!"));
  // });