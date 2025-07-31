const express=require("express")
const router=express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema} =require("../schema.js");
const Listing=require("../models/listing.js");
const {isLoggedIn, isOwner,validateListing } = require("../middleware.js");
const multer  = require('multer')
const {storage}=require("../cloudConfig.js");
const upload = multer({storage});


const listingController = require("../controllers/listings.js");

//index  //create
router.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIn,
  upload.single("listing[image]"),
  validateListing,
  wrapAsync(listingController.createListing));


// New Route
router.get("/new",isLoggedIn,listingController.renderNewForm);

//NewRoute...update route
router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(isLoggedIn,isOwner,
  upload.single("listing[image]"),
  validateListing,
  wrapAsync(listingController.renderUpdate))
.delete(isLoggedIn,isOwner,wrapAsync(listingController.Delete));

//Edit Route...
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync (listingController.renderEditForm )
);

module.exports=router;