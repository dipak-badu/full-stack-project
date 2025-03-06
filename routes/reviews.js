const express = require("express");
const router = express.Router({mergeParams:true});
const  wrapAsync = require("../utils/wrapAsync.js");
const {validateReview} = require("../middleware.js")
const { isLoggIn , isReviwAuthor} = require("../middleware.js");
const reviewController = require("../controllers/review.controllers.js")

// get review route 
router.get("/", wrapAsync(reviewController.rederReviewForm))

// post review route 
router.post("/",
     isLoggIn , 
     validateReview ,
     wrapAsync(reviewController.addReview ));

// delete review  route
router.delete("/:reviewId",
     isLoggIn,
     isReviwAuthor,
      wrapAsync(reviewController.deleteReview))


module.exports =router