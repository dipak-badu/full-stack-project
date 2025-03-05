const express = require("express");
const router = express.Router({mergeParams:true});
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const ExpressError = require("../utils/ExpressError.js");
const  wrapAsync = require("../utils/wrapAsync.js");
// const { reviewSchema} = require("../schema.js");
const {validateReview} = require("../middleware.js")
const { isLoggIn , isReviwAuthor} = require("../middleware.js");

// get review route 
router.get("/", wrapAsync(async(req,res)=>{
    let {id }= req.params
   console.log(req.params.id)
        let listing = await Listing.findById(id).populate({ 
            path:"reviews", 
            populate:{
            path:"author"
        }})
        if(!listing){
            throw new ExpressError(404, "Listing not found!!")
        }
    res.render("review.ejs", {listing})
}))

// post review route 
router.post("/", isLoggIn , validateReview ,wrapAsync( async (req, res) => {
   
        let { id } = req.params;
        if (!id ){
            throw new ExpressError(400, "Id not found!")   
        }
        let listing = await Listing.findById(id);
 
        if (!listing) {
           throw new ExpressError( 404, "Listing not found");
        }


        let newReview = new Review(req.body.review);
         newReview.author = req.user._id;
         console.log(newReview)
        listing.reviews.push(newReview);  
        await newReview.save();
        await listing.save();

        console.log("New review saved");
        req.flash("success", "Review is Added" )
        res.redirect(`/listings/${listing._id}/reviews`); // Redirect to the listing page 
}));

// delete review  route
router.delete("/:reviewId", isLoggIn,isReviwAuthor, wrapAsync(async(req, res)=>{
    let {id , reviewId}= req.params;
    if(!id || !reviewId){
        throw new ExpressError(400, "Id or reviewId not found!!")
    }
    await Listing.findByIdAndUpdate(id, {
        $pull:{ reviews:reviewId}
    })
 let result =  await Review.findByIdAndDelete(reviewId)
// console.log(result)
req.flash("success", "review Deleted!" )
   res.redirect(`/listings/${id}/reviews`)
}))


module.exports =router