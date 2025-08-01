const express=require("express")
const router=express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {validateReview, isLoggedIn,isReviewAuthor}=require("../middleware.js");
const Listing=require("../models/listing.js");
const Review=require("../models/review.js");
const reviewController = require("../controllers/reviews.js");
const review = require("../models/review.js");


//Reviews post route
router.post("/",
  isLoggedIn,
  validateReview,
  wrapAsync(reviewController.createReview ));
////


router.delete("/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviewController.destroyReview));
  

module.exports=router;