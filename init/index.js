//database connection setup
const mongoose =require("mongoose");
async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}
main()
.then(()=>{
    console.log("database connection succeed");
})
.catch((err)=>{
    console.log("database connection error");
})

//require data from data.js
const initdata=require("./data.js");

//requiring model(collection) from models
const Listing=require("../models/listing.js");

//data insertion
const initDB=async ()=>{
    await Listing.deleteMany({});
    initdata.data=initdata.data.map((obj)=>({
        ...obj,
        owner:"68807a5ac1239af4a5c1b1ce"
    }))
    await Listing.insertMany(initdata.data);
    console.log("database was initialized");
}
initDB();