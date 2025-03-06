const express = require("express");
const router = express.Router();
const  wrapAsync = require("../utils/wrapAsync.js")

const passport = require("passport");
const isLoggIn = require("../middleware.js")
const{ saveRedirectUrl} = require("../middleware.js")
const userController = require("../controllers/user.controllers.js")

// user sigup get route
router.get("/signup", 
  wrapAsync(userController.getSingup))

// user signup post route 
router.post("/signup", 
  wrapAsync(userController.postSignup)) 


// user login get route 
router.get("/login", wrapAsync(userController.getLogin))

// user login post route 
router.post("/login", 
  saveRedirectUrl, 
   passport.authenticate("local", {failureRedirect:"/login" , failureFlash:true}),
    wrapAsync(userController.postLogin))

// user log out get request 
router.get("/logout", userController.logOut )
  
module.exports= router