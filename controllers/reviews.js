const Listing =require("../models/listing");
const Review = require("../models/review");

module.exports.createReview =async(req, res)=>{
    const { id } = req.params;
 let listing= await Listing.findById(id);
 if(!listing){

 
 req.flash("success","New Review Added!")

res.redirect(`/listings/${listing._id}`);
 }
 let newReview = new Review(req.body.review);
 newReview.author =  req.user._id;
 console.log(newReview);
 
 await newReview.save();
 listing.reviews.push(newReview);
 await listing.save();
 
 req.flash("success","New Review Added!")
res.redirect(`/listings/${listing._id}`);
};

module.exports.destroyReview =async (req, res)=>{
  let {id,reviewId}=req.params;
  await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
  await Review.findByIdAndDelete(reviewId);
   req.flash("success"," Review Delete! ")
  res.redirect(`/listings/${id}`);
};