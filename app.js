
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require('path');
const { get } = require("http");
const methodOverride = require('method-override');
const ejsMate = require("ejs-mate");
const passport= require("passport")
const LocalStrategy = require("passport-local")
const User= require("./models/user.js")
const cookieParser = require('cookie-parser')
const session = require('express-session');
const flash = require("connect-flash"); 
const favicon = require("serve-favicon");


// *********************** Some middlawares *********************** 
app.use(express.json()); 
app.set("views", path.join(__dirname , "views"));
app.set("views", "./views");
app.set("view engine", "ejs");
mongoose.set("strictPopulate", false);
app.use(express.urlencoded({ extended: true }));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));
app.use(methodOverride('_method'))
app.use(favicon(path.join(__dirname, "public", "favicon.ico")));

// ************ connect to Database *************** 
const MONGO_URL = `mongodb://127.0.0.1:27017/wanderlust`;

try {
     main();
    console.log("Connected to DB!!")
} catch (error) {
    console.error("Failed to connect to the database:", error);
  
}

async function main(){
    await mongoose.connect(MONGO_URL)
}

app.get("/", (req, res)=>{
    res.send("Hii working properly")
})

// *********************session & flash ****************************** 
const sesionOPtions ={
    secret:"mysupersecretcode",
    resave:false,
    saveUninitialized:true,
    cookie: {
        expires: Date.now() +( 7*24*60*60*1000),
        maxAge:1000*60*60*24*7,
        httpOnly:true
    }
}
app.use(session(sesionOPtions))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next)=>{
    res.locals.success= req.flash("success");
    res.locals.error= req.flash("error")
    res.locals.currUser= req.user
    next();
})

// app.get("/demouser", async(req, res)=>{
//     let fakeUser = new User({
//         email: "student@gmail.com",
//         username:"meemansa"
//     })
//     let registerUser = await User.register(fakeUser, "wordwar")
//     res.send(registerUser)
// })

// ****************** routes ********************** 
const listingsRouter = require("./routes/listings.js")
const reviewsRouter = require("./routes/reviews.js")
const userRouter = require("./routes/user.routes.js")

// ************** use Routes ***********************
app.use("/listings", listingsRouter)
app.use("/listings/:id/reviews", reviewsRouter)
app.use("/", userRouter)


app.all("*", (req, res, next)=>{
next(new ExpressError(404, "page not found!"))
})
            
app.use((error, req, res , next)=>{
let { statusCode = 500, message="someting went wrong"} = error;
res.status(statusCode).render("error.ejs" , { message});
})

app.listen(3000, ()=>{
    console.log("listening to the port 3000")
})



