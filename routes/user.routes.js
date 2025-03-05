const express = require("express");
const router = express.Router();
const ExpressError = require("../utils/ExpressError.js");
const  wrapAsync = require("../utils/wrapAsync.js")
const User = require("../models/user.js");
const passport = require("passport");
const isLoggIn = require("../middleware.js")
const{ saveRedirectUrl} = require("../middleware.js")

// user sigup get route
router.get("/signup", wrapAsync(async(req, res)=>{
    //   res.send("form")
    res.render('user/signup');
}))

// user signup post route 
router.post("/signup", wrapAsync(async(req, res)=>{
try {
    let {username, password, email} = req.body;
    const newUser = new User({
     username, email
    })
   const registerUser =  await User.register(newUser, password)
// automatic login when user is registed  
          req.login(registerUser, (err)=>{
    if (err){
        return next(err)
    }
    req.flash("success", "you are logged in") 
    res.redirect("/listings")
})
   
} catch (error) {
req.flash("error", error.message)
res.redirect("/signup")
}
})) 


// user login get route 
router.get("/login", wrapAsync(async(req, res)=>{
    res.render("user/login")
}))

// user login post route 
router.post("/login", saveRedirectUrl,  passport.authenticate("local", {failureRedirect:"/login" , failureFlash:true}), wrapAsync(async(req, res)=>{
   req.flash("success", "you are logged in") 
   let redirectUrl = res.locals.redirectUrl || "/listings";
   
   res.redirect(redirectUrl)
}))

// user log out get request 
router.get("/logout", async( req, res , next)=>{
  req.logout((err)=>{
    if(err){
     return   next(err);
    }
    req.flash("success", "loggout successfully!")
    res.redirect("/listings")
  }) 
})
module.exports= router