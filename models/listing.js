const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const listingSchema=Schema({
    title:{
        type:String,
        require:true
    },
    description:{
        type:String,
    },
    image:{
        url:String,
        filename:String,
    },
    price:Number,
    location:String,
    country:String,
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"review"
        }
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    category:{
        type:String,
        enum:["Trending","Rooms","Beach","Pools","LakeFront","MountainCity","Castles","Camping","Farm","Arctic","Dome","HouseBoat","Building"],

    }
})
const Review=require("./review.js");
//mongoose middleware
listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
    await Review.deleteMany({_id:{$in: listing.reviews}})
    }
})

const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;