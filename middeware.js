const Listing = require("./model/listing.js");
const Review= require("./model/review.js");
const {listingSchema, reviewSchema} = require("./schema.js");  //for validation of schema
const ExpressError = require("./utils/ExpressError.js");

module.exports.isloggedIn = (req, res, next)=>{
    
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","You must be logged in to create listing");
        return res.redirect("/login");
    }
    next();
}

module.exports.savedRedirectUrl = (req, res, next) =>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async(req, res, next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error", "You are not the owner of this listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.validatelistinig = (req,res,next) =>{
    const {error} = listingSchema.validate(req.body);
    //console.log(error.message);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(404, errMsg);
    }else{
        next();
    }
}

module.exports.validatereview = (req,res,next) =>{
    const {error} = reviewSchema.validate(req.body);
    //console.log(error.message);
    if(error){
        console.log(error);
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(404, errMsg);
    }else{
        next();
    }
}

module.exports.isReviewAuthor = async(req, res,next) =>{
    let {id} = req.params;
    let {reviewid} = req.params;
    let listing = await Review.findById(reviewid);
    if(!review.author._id.equals(res.locals.currUser._id)){
        req.flash("error", "You are not the author of this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
}