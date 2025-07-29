const express=require("express")
const router=express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema} =require("../schema.js");
const Listing=require("../models/listing.js");
const {isLoggedIn, isOwner,validateListing } = require("../middleware.js");

const listingController = require("../controllers/listings.js");


//index route
router.get("/",wrapAsync(listingController.index)
);



// New Route
router.get("/new",isLoggedIn,listingController.renderNewForm);



//show Route . . .
router.get("/:id",wrapAsync(listingController.showListing));

//create Route

router.post("/",isLoggedIn,validateListing,wrapAsync(listingController.createListing));

//Edit Route...
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync (listingController.renderEditForm )
);

//delete
router.delete("/:id",isLoggedIn,isOwner,wrapAsync(listingController.Delete));

//update route
router.put("/:id",isLoggedIn,isOwner,validateListing,
  wrapAsync(listingController.renderUpdate));

module.exports=router;