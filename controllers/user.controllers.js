const ExpressError = require("../utils/ExpressError.js");
const User = require("../models/user.js");
// get sign up 
module.exports.getSingup = async(req, res)=>{
    //   res.send("form")
    res.render('user/signup');
}

// user signup post
module.exports.postSignup = async(req, res)=>{
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
}


// user login get
module.exports.getLogin = async(req, res)=>{
    res.render("user/login")
}

// user login post 
module.exports.postLogin = async(req, res)=>{
    req.flash("success", "you are logged in") 
    let redirectUrl = res.locals.redirectUrl || "/listings";
    
    res.redirect(redirectUrl)
 }

 // user log out get 
 module.exports.logOut = async( req, res , next)=>{
    req.logout((err)=>{
      if(err){
       return   next(err);
      }
      req.flash("success", "loggout successfully!")
      res.redirect("/listings")
    }) 
  }