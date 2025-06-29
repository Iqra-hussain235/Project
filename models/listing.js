const mongoose = require('mongoose');
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
});

const Listing = mongoose.model("Listing",listingSchema);
module.exports=Listing;