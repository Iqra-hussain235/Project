const express =require("express");
const app=express();
const mongoose =require("mongoose");
const Listing=require("./models/listing.js");
const path=require("path");
const methodOverride = require("method-override");
const ejsMate =require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema} =require("./schema.js");


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




app.get("/",(req,res)=>{
   res.send("succesfullt");
});

const validateListing =(req,res,next)=>{
 //joi use
  let {error}=listingSchema.validate(req.body);
  
  if(error){
    let errMsg =error.details.map((el)=>el.message).join(",");
    
    throw new ExpressError(400,errMsg);
  }
  else{
    next();
  }

}


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


// new Route

app.get("/listings/new", wrapAsync(async(req, res) => {
  res.render("listings/new.ejs");
})
);
// Create route
// app.post("/listings",async (req,res)=>{

// let {title, description, price, image, country, location}=req.body;

// });


//create Route

app.post("/listings",validateListing,wrapAsync(async(req, res,next)=>{
  

  const newListing =new Listing(req.body.listing);
  //it can detect error but that process it to long or complexed then we use joi
  // if(!req.body.listing){
  //   throw new  ExpressError(400,"send valid data for listing");
  // }
  //  if(!newListing.title){
  //   throw new  ExpressError(400,"title is missing!");
  //  } 
  //   if(!newListing.description){
  //   throw new  ExpressError(400," description is missing!");
  //  } 
  //      if(!newListing.location){
  //   throw new  ExpressError(400," location  is missing!");
  //  } 

    await newListing.save();
    res.redirect("/listings");
  })
);

//show route . . .
app.get("/listings/:id",wrapAsync(async (req, res) => {
 
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/show.ejs", { listing });
})
);


//Edit Route...
app.get("/listings/:id/edit",wrapAsync (async(req,res)=>{
  
  let  {id} =req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs",{listing});

 })
);

//update route
app.put("/listings/:id",validateListing,wrapAsync(async(req,res)=>{
  if(!req.body.listing){
    throw new  ExpressError(400,"send valid data for listing");
  }
  let  {id} =req.params;
 

  await Listing.findByIdAndUpdate(id, {...req.body.listing});
  res.redirect(`/listings/${id}`);

})
);


app.get("/listings",wrapAsync(async (req, res) => {
  // if(!req.body.listing){
  //   throw new  ExpressError(400,"send valid data for listing");
  // }
  
  const allListings = await Listing.find({});
  res.render("listings/index", { allListings });
})
);

//
app.delete("/listings/:id",wrapAsync(async(req,res)=>{
  if(!req.body.listing){
    throw new  ExpressError(400,"send valid data for listing");
  }
let  {id} =req.params;
let deletedListing = await Listing.findByIdAndDelete(id);
console.log(deletedListing);
res.redirect("/listings");
})
);







// app.use((err,req,res,next)=>{
//   let {statusCode=500,message="something wronge"}=err;
//   res.status(statusCode).send(message);
//   res.send("somethiing went wronge");
// });


// app.all("*", (req, res, next) => {
//   next(new ExpressError(404, "Page Not Found!"));
// });

app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).render("error.ejs",{message});
  // res.status(statusCode).send(message);
});
//wraperror handle



app.listen(8080,()=>{
    console.log("server is listening to port 8080");
});