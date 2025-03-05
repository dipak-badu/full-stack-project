const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    comment: String,
    rating: {
        type:Number,
        min:1,
        max:5
    },
    author:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }
    // createdAt:{
    //     type:Date,
    //     default: Date.now();
    // }
}, {timestamps:true})

const Review = mongoose.model("Review", reviewSchema)
module.exports = Review;