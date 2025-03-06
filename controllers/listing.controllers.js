const Listing = require("../models/listing.js")
const ExpressError = require("../utils/ExpressError.js");
const User = require("../models/user.js")


// index route 
module.exports.index = async(req, res)=>{
   
    let allListings=   await Listing.find();
   
    
    if(!allListings){
       throw new ExpressError(500, "Error while finding listings")
    }
    res.render("index.ejs", {allListings})
   }

//  get new route 
module.exports.renderNewFOrm = async(req, res )=>{
 
    res.render("new.ejs");
}
// post new route 
module.exports.createListing = async(req, res) => {
    try {
        if (!req.user) {
            req.flash("error", "You must be logged in to create a listing");
            return res.redirect("/login");
        }
        let { title, description, image, price, location, country } = req.body;
        const newListing = new Listing({
            title,
            description,
            price,
            location,
            country,
            image: {
                url: image === "" 
                    ? `https://plus.unsplash.com/premium_photo-1737024251796-dd751b4d9365?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxfHx8ZW58MHx8fHx8` 
                    : image,
            },
            owner: req.user._id
        });
        // console.log(req.user);
        
        await newListing.save();
        req.flash("success", "New Listing Created!");
        res.redirect("/listings");

    } catch (error) {
        req.flash("error", error.message);
        res.redirect("/listings");
    }
}


// show all listings 
module.exports.showRoute = async(req, res)=>{
    let {id} = req.params
  if(! id){
    throw new ExpressError(400, "Id not found!")
  }

    let listing = await Listing.findById(id).populate({ 
        path:"reviews", 
        populate:{
        path:"author"
    }}).populate("owner");
    if(!listing){
      req.flash("error", "Listing you requested for does not exists")
      res.redirect("/listings")
    }
   console.log(listing)
    res.render("show.ejs", {listing, currUser:req.user})
}

// get request for edit 
module.exports.renderEditForm = async(req, res)=>{
    let {id} = req.params
    if(!id){
        throw new ExpressError(400, "Id not found!")  
    }
  
       
        let listing = await Listing.findById(id);
        // console.log(listing);
        if(!listing){
            req.flash("error", "Listing you requested for does not exists")
            res.redirect("/listings") 
        }
        res.render("edit.ejs", {listing})
}

// put request for edit 
module.exports.editListing = async(req, res)=>{  
    let {id} = req.params
    let {title, description, image , price, location, country } = req.body
    
        if(!id){
            throw new ExpressError(400, "Id not found!")   
        }
       const updatePayload = {
        title,
        description,
        
        price,
        location,
        country
       }
       if (image) {
        updatePayload.image = {
            url: image === "" 
                ? `https://plus.unsplash.com/premium_photo-1737024251796-dd751b4d9365?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxfHx8ZW58MHx8fHx8` 
                : image,
        };
    }
    
    const updateListing = await Listing.findByIdAndUpdate(id, updatePayload,
        {
        new:true, runValidators:true
    })
       if(!updateListing){
      throw new ExpressError(500, "Error while updating listing!")
       }
       req.flash("success", "Listing is Edited" )
        res.redirect("/listings")
}

// delete route 
module.exports.deleteLising = async(req, res)=>{
    let {id} = req.params;
   
        if(!id){
           throw new ExpressError(400, "No id found!!");  
        }
   let deletedLIsting = await Listing.findByIdAndDelete(id);
   if(!deletedLIsting){
    throw new ExpressError(500, "Error while deleting listing")
   }
           req.flash("success", "Listing Deleted!" )
        res.redirect("/listings")
}