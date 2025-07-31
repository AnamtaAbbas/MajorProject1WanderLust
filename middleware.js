const ExpressError=require("./utils/ExpressError.js");

//requiring listing schema defined through joi for server side validation(schema validation)
const {listingSchema,reviewSchema}=require("./schema.js");
//requiring review model
const Review=require("./models/review.js");
const Listing=require("./models/listing.js")
module.exports.isloggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","login required!");
        return res.redirect("/login");
    }
    next();
}

module.exports.redirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner=async(req,res,next)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","Permission denied");
        return res.redirect(`/listings/${id}`);
    }
    next();
}
//defining function for validatelisting at server side
module.exports.validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        let errmsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errmsg);
    }
    else{
        next();
    }
    
}

module.exports.validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        let errmsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errmsg);
    }
    else{
        next();
    }
    
}

module.exports.isReviewAuthor=async(req,res,next)=>{
    let {id,reviewId}=req.params;
    let review=await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","Permission denied!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}