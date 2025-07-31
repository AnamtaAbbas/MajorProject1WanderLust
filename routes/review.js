const express=require("express");
const router=express.Router({mergeParams:true});
//requiring wrapAsync
const wrapAsync=require("../utils/wrapAsync.js");
//requiring model Listing
const Listing=require("../models/listing.js");
//requiring ExpressError
const ExpressError=require("../utils/ExpressError.js");

//requiring listing schema defined through joi for server side validation(schema validation)
const {listingSchema,reviewSchema}=require("../schema.js");
//requiring review model
const Review=require("../models/review.js");

//defining function for validatelisting at server side
//serverside review schema validation
const {validateReview, isloggedIn, isReviewAuthor}=require("../middleware.js");
const reviewController=require("../controllers/reviews.js");
//route for review adding to a particular listing
router.post("/",isloggedIn,validateReview,wrapAsync(reviewController.createReview));

router.delete("/:reviewId",isloggedIn,isReviewAuthor,wrapAsync(reviewController.destroyReview));

module.exports=router;