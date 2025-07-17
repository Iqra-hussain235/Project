const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const reviewSchema = new Schema({
    comments:String,
    rating:{
        type: Number,
        min: 1,
        max: 3

    },
    createdAt:{
        type: Date,
        default: Date.now()
    }

    
});
module.exports=mongoose.model("Review",reviewSchema);