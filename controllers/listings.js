const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

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

  // Optional: validate category explicitly
    // const allowed = ['mountains', 'artic', 'farms', 'deserts'];
    // if (!allowed.includes(listing.category)) {
    //   return res.status(400).send({ error: 'Invalid category.' });
    // }
  
  let response = await geocodingClient
  .forwardGeocode({
  query: req.body.listing.location,
  limit: 1,
   })
  .send();
  
  let url =req.file.path;
  let filename =req.file.filename;
  
  const newListing =new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image ={url,filename};

  newListing.geometry = response.body.features[0].geometry;

     let savedListing = await newListing.save();
     
     console.log(savedListing);
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
  let originalImageUrl = listing.image.url;
  originalImageUrl=originalImageUrl.replace("/upload","/upload/h_300,w_250");
   req.flash("success","Edit listing!")
  res.render("listings/edit.ejs",{listing,originalImageUrl});
};

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
  let listing = await listing.findByIdAndUpdate(id, {...req.body.listing});

  if(typeof req.file !== "undefined"){
  let url =req.file.path;
  let filename =req.file.filename; 
  listing.image ={url,filename};
  await listing.save()
}
req.flash("success","Updated Listing!")
res.redirect(`/listings/${id}`);
}