const mongoose = require("mongoose")
const Schema = mongoose.Schema;
const Review =require("./review.js")

const listingSchema = new Schema({
     title: {
        type: String,
        required:true
     } ,
     description :{
        type:String
     },
     image: {
     
       url:{ type:String,
         default: `https://plus.unsplash.com/premium_photo-1737024251796-dd751b4d9365?q=80&w=1032&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`,
         set: (v)=>v==="" ? `https://plus.unsplash.com/premium_photo-1737024251796-dd751b4d9365?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxfHx8ZW58MHx8fHx8` :v}
     },
     price: Number,
     location: String,
     country: String,
     reviews:[
      {
         type:Schema.Types.ObjectId,
         ref:"Review",

      }

     ],
owner: {
   type:Schema.Types.ObjectId,
   ref:"User"
}
}, {timestamps:true});


listingSchema.post("findOneAndDelete", async(listing)=>{
if(listing){
   await Review.deleteMany({_id: {$in:listing.reviews
   }})
}
})

const Listing = mongoose.model("Listing", listingSchema)  
module.exports = Listing