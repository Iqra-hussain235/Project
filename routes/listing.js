const express=require("express")
const router=express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema} =require("../schema.js");
const Listing=require("../models/listing.js");






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

//index route
router.get("/",wrapAsync(async (req, res) => {
  // if(!req.body.listing){
  //   throw new  ExpressError(400,"send valid data for listing");
  // }
  
  const allListings = await Listing.find({});
  res.render("listings/index", { allListings });
})
);

// new Route

router.get("/new", wrapAsync(async(req, res) => {
  res.render("listings/new.ejs");
})
);


//show route . . .
router.get("/:id",wrapAsync(async (req, res) => {
 
  let { id } = req.params;
  const listing = await Listing.findById(id).populate("reviews");
  res.render("listings/show.ejs", { listing });
})
);

//create Route

router.post("/",validateListing,wrapAsync(async(req, res,next)=>{
  

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
    req.flash("success","New listing Created!");
    res.redirect("/listings");
  })
);

//Edit Route...
router.get("/:id/edit",wrapAsync (async(req,res)=>{
  
  let  {id} =req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs",{listing});

 })
);

//delete
router.delete("/:id",wrapAsync(async(req,res)=>{
  // if(!req.body.listing){
  //   throw new  ExpressError(400,"send valid data for listing");
  // }
let  {id} =req.params;
let deletedListing = await Listing.findByIdAndDelete(id);
console.log(deletedListing);
res.redirect("/listings");
})
);

//update route
router.put("/:id",validateListing,wrapAsync(async(req,res)=>{
  if(!req.body.listing){
    throw new  ExpressError(400,"send valid data for listing");
  }
  let  {id} =req.params;
 

  await Listing.findByIdAndUpdate(id, {...req.body.listing});
  res.redirect(`/listings/${id}`);

})
);

module.exports=router;