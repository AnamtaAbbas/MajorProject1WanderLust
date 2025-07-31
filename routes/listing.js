const express=require("express");
const router=express.Router();

//requiring wrapAsync
const wrapAsync=require("../utils/wrapAsync.js");

//requiring ExpressError
const ExpressError=require("../utils/ExpressError.js");

//requiring listing schema defined through joi for server side validation(schema validation)
const {listingSchema,reviewSchema}=require("../schema.js");


//requiring model Listing
const Listing=require("../models/listing.js");

//requiring middleware and controllers
const {isloggedIn, isOwner,validateListing}=require("../middleware.js");
const listingController =require("../controllers/listings.js");

//requiring multer for parsing form data
const multer  = require('multer')
const{storage}= require("../cloudConfig.js");
const upload = multer({ storage})

//index route
router.route("/")
.get(wrapAsync(listingController.Index))
.post(isloggedIn,validateListing,upload.single('listing[image]'),wrapAsync(listingController.createListing))

//new route
router.get("/new",isloggedIn,listingController.renderNewForm)

//show route and update route
router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(isloggedIn,isOwner,upload.single('listing[image]'),validateListing,wrapAsync(listingController.updateListing))
.delete(isloggedIn,isOwner,wrapAsync(listingController.destroyListing))

//edit route
router.get("/:id/edit",isloggedIn,isOwner,wrapAsync(listingController.editListing))


module.exports=router;