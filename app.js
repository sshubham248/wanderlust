if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}
//console.log(process.env.SECRET);
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./model/user.js");


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended : true}));
app.use(methodOverride("_method"))
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")))

const db_url = process.env.ATLAS_URL;
main()
    .then(() =>{
        console.log("connected to DB");
    })
    .catch((err) =>{
        console.log(err);
    })
async function main() {
    await mongoose.connect(db_url);
}


const store = MongoStore.create({
    mongoUrl: db_url,
    crypto : {
        secret : process.env.SECRET,
    } ,
    touchAfter : 24*3600,
  });

const sessionOption = {
    store,
    secret :  process.env.SECRET,
    resave : false,
    saveUninitialized : true,
    cookie : {
        expires : Date.now() + 7*24*60*60,
        maxAge : 7*24*60*60,
        httpOnly : true
    }
};

store.on("error", ()=>{
    console.log("error in mongo store ",error);
})
app.get("/",(req, res) =>{
    res.send("app is working");
});
app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

// use static authenticate method of model in LocalStrategy
passport.use(new localStrategy(User.authenticate()));

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next)=>{
    res.locals.successMsg = req.flash("success");
    res.locals.errorMsg = req.flash("error");
    res.locals.currUser = req.user;
    next();
})


//Listings
app.use("/listings", listingsRouter);
//Reviews
app.use("/listings/:id/reviews", reviewsRouter);
//User
app.use("/", userRouter);


app.all("*", (req, res, next)=>{
    next(new ExpressError(404,"Page not found"))
})
app.use((err,req,res, next)=>{
    let {status = 500, message = "Something went wrong"} = err;
    res.status(status).render("error.ejs",{err});
    
})


app.listen(8080, () =>{
    console.log("app is listening on port 8080");
});