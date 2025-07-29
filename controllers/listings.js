const Listing = require("../models/listing");

module.exports.index=async (req, res) => {  
  const allListings = await Listing.find({});
  res.render("listings/index", { allListings });
};

module.exports.renderNewForm = (req, res)=>{
  res.render("listings/new.ejs");
}

module.exports.showListing=async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
  .populate({path:"reviews",
    populate:{
    path:"author",
  },
})
  .populate("owner");
  if(!listing){
    req.flash("error","Listing you requested for does not exist!");
     return res.redirect("/listings");
  }
  console.log(listing);
  res.render("listings/show.ejs", { listing });
}

module.exports.createListing=async(req, res,next)=>{
  const newListing =new Listing(req.body.listing);
  newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success","New listing Created!");
    res.redirect("/listings");
}

module.exports.renderEditForm =async(req,res)=>{
  
  let  {id} =req.params;
  const listing = await Listing.findById(id);
   if(!listing){
    req.flash("error","Listing you  requested for edit  does not exist!");
     return res.redirect("/listings");
  }
   req.flash("success","Edit listing!")
  res.render("listings/edit.ejs",{listing});
}

module.exports.Delete=async(req,res)=>{
let  {id} =req.params;
let deletedListing = await Listing.findByIdAndDelete(id);
console.log(deletedListing);
req.flash("success","Delete Succefully!");
res.redirect("/listings");
}

module.exports.renderUpdate=async(req,res)=>{
  if(!req.body.listing){
    throw new  ExpressError(400,"send valid data for listing");
  }
  let  {id} =req.params;
  await Listing.findByIdAndUpdate(id, {...req.body.listing});
   req.flash("success","Updated Listing!")
   res.redirect(`/listings/${id}`);
}