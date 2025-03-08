const express = require("express");
const router = express.Router();
const  wrapAsync = require("../utils/wrapAsync.js");
const { isLoggIn  } = require("../middleware.js");
const {isOwner ,validateListing}= require("../middleware.js")
const listingController = require("../controllers/listing.controllers.js")
const {storage} = require("../cloudConfig.js")
const multer  = require('multer')
const upload = multer({ storage})// save in cloudinary storage 

// get all Listings 
router.get("/",
    wrapAsync( listingController.index))


// create new listing
router.get("/new", 
    isLoggIn, 
    wrapAsync(listingController.renderNewFOrm))

// create route for adding new listing
router.post("/",
    isLoggIn, 
   upload.single('image'),
    validateListing, 
    wrapAsync(listingController.createListing ));



// get details about the specific listing 
router.get("/:id", 
    wrapAsync(listingController.showRoute ))

// get request for update 
router.get("/:id/edit",  
    isLoggIn, isOwner, 
    wrapAsync( listingController.renderEditForm))

// patch request for upadate 
router.put("/:id", 
      isLoggIn,
      isOwner,
      upload.single('image'),
      validateListing, 
      wrapAsync( listingController.editListing))


// Delete route 
router.delete("/:id",
    isLoggIn, 
    isOwner, 
    wrapAsync(listingController.deleteLising))

module.exports= router