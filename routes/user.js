const express=require("express");
const router=express.Router();
const User=require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { redirectUrl } = require("../middleware.js");
const userController=require("../controllers/user.js");
router.route("/signup")
.get(userController.renderSignup)
.post(wrapAsync(userController.signup));

router.route("/login")
.get(userController.renderLogin)
.post(redirectUrl,passport.authenticate("local",{ failureRedirect: '/login', failureFlash:true}),userController.login);

router.get("/logout",userController.logout);
module.exports=router;