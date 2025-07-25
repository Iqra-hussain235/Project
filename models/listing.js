const mongoose = require('mongoose');
const Review = require('./review');
const Schema =mongoose.Schema;

const listingSchema =new Schema({
    title:
    {
        type:String,
        required:true,
    },
    description:{

        type:String,
    },

  image: {
    filename: String,
  url:{
      type: String,
      default:
        "https://images.unsplash.com/photo-1621186942921-b524d6264c2e?auto=format&fit=crop&w=800&q=80",
    //   set: (v) => {
    //     if (!v || v.trim() === "") {
    //       return "https://images.unsplash.com/photo-1621186942921-b524d6264c2e?auto=format&fit=crop&w=800&q=80";
    //     }
    //     return v;
    //   },

      set: (v) =>
      v === ""
        ? "https://images.unsplash.com/photo-1621186942921-b524d6264c2e?auto=format&fit=crop&w=800&q=80"
        : v,
    
  },
},



    

    price:{

        type:Number,
   },
   
    location:{
        type:String
    },
    country:{

        type:String,
    },
    reviews:[
      {
        type: Schema.Types.ObjectId,
        ref:"Review",
      }
    ],
});

listingSchema.post("findOneAndDelete",async (listing)=>{
  if(listing){

    await Review.deleteMany({_id:{$in: listing.review}});
  }

});



const Listing = mongoose.model("Listing",listingSchema);
module.exports=Listing;