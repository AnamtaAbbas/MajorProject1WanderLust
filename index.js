if(process.env.NODE_ENV !="production"){
    require('dotenv').config()  //dotenv loads env file into this file 
}
console.log(process.env.SECRET)

//server setup
const express=require("express");
const app=express();
app.listen(8080,()=>{
    console.log("Server is listening");
})

//requiring path
const path=require("path");
//serving static files for applying css styling and js functionality
app.use(express.static(path.join(__dirname,"/public")));

//requiring ejs mate for adding layouts in templates
const ejsMate=require("ejs-mate"); 
app.engine("ejs",ejsMate)

//requiring method overriding for put and delete request
const methodOverride=require("method-override");
app.use(methodOverride("_method"));


//set up EJS
const ejs=require("ejs");
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"))
//for making express able to parse data
app.use(express.urlencoded({extended:true}));

//requiring passport for authentication
const passport=require("passport");
const localStrategy=require("passport-local");
const User=require("./models/user.js");
//connecting to database
const mongoose=require("mongoose");
const dbUrl=process.env.ATLASDB_URL;
async function main(){
    await mongoose.connect(dbUrl);
}
main()
.then(()=>{
    console.log("connected to DB");
})
.catch((err)=>{
    console.log("error in connecting DB",err);
})

//requiring ExpressError
const ExpressError=require("./utils/ExpressError.js");

//requiring listing schema defined through joi for server side validation(schema validation)
const {listingSchema,reviewSchema}=require("./schema.js");

//requiring listing's all route
const listingRoute=require("./routes/listing.js");

//requiring review route
const reviewRoute=require("./routes/review.js");

//requiring user route
const userRoute=require("./routes/user.js");

//requiring express-session
const session=require("express-session");
const MongoStore = require('connect-mongo');
const store=MongoStore.create({
    mongoUrl: dbUrl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter: 24*3600,
});

store.on("error",()=>{
    console.log("error in mongo session store",err);
});
const sessionOptions={
    store,
    secret: process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge:7 * 24 * 60 * 60 * 1000,
        httpOnly:true
    }
};
//requiring flash
const flash=require("connect-flash");

const router = express.Router();
const listingController = require("./controllers/filterlistings.js");





app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
})




app.use("/listings",listingRoute);



// Route for filtering listings by category


app.use("/listings/:id/reviews",reviewRoute);
app.get("/listings/category/:categoryName", listingController.filteredByCategory);
app.post("/search",listingController.filteredByLocation);

app.use("/",userRoute);

//for having request for that route that doesnt exist
app.all('/{*any}',(req,res,next)=>{
    next(new ExpressError(404,"PAGE NOT FOUND"));
})

//error handler middleware
app.use((err,req,res,next)=>{
    let {status=500,message="SOMETHING BROKE"}=err;
    res.status(status).render("error.ejs",{status,message}) 
})



