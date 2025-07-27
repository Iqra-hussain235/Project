const express=require("express")
const router=express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {reviewSchema} =require("../schema.js");
const Review=require("../models/review.js");

const Listing=require("../models/listing.js");



//validate review
const validateReview =(req,res,next)=>{
 //joi use
  let {error}=reviewSchema.validate(req.body);
  
  if(error){
    let errMsg =error.details.map((el)=>el.message).join(",");
    
    throw new ExpressError(400,errMsg);
  }
  else{
    next();
  }

};

//Reviews post route
router.post("/",
  validateReview,
  wrapAsync(async(req, res)=>{
 let listing= await Listing.findById(req.params.id);
 let newReview = new Review(req.body.review);

 listing.reviews.push(newReview);

 await newReview.save();
 await listing.save();
 req.flash("success","New Review Added!")

res.redirect(`/listings/${listing._id}`);
////

// const { id } = req.params;
//   const listing = await Listing.findById(id);
//   const review = new Review(req.body.review);
//   listing.reviews.push(review);

//   await review.save();
//   await listing.save();

//   req.flash("success", "New Review Added!");
//   res.redirect(`/listings/${id}`);
  
// console.log("new Review saved");
// res.send("new review saved");

}));

//delete review route
router.delete("/:reviewId",
  wrapAsync(async (req, res)=>{
  let {id,reviewId}=req.params;
  await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
  await Review.findByIdAndDelete(reviewId);
   req.flash("success"," Review Delete! ")
  res.redirect(`/listings/${id}`);
}));

module.exports=router;