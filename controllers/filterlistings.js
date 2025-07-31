const Listing=require("../models/listing.js");
module.exports.filteredByCategory = async (req, res) => {
    const { categoryName } = req.params;
    const filteredListings = await Listing.find({ category: categoryName });

    if (filteredListings.length === 0) {
        req.flash("error", `No listings found for category "${categoryName}"`);
        return res.redirect("/listings");
    }

    res.render("listings/index.ejs", { allListings: filteredListings , selectedCategory: categoryName });
};

module.exports.filteredByLocation=async(req,res)=>{
    const {locationName}=req.body;
    console.log(locationName);
    const filteredListings=await Listing.find({ location: locationName });
     if (filteredListings.length === 0) {
        req.flash("error", `No listings found for category "${locationName}"`);
        return res.redirect("/listings");
    }
 res.render("listings/index.ejs", { allListings: filteredListings});   
}