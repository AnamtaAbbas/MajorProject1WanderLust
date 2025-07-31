const Listing=require("../models/listing.js");
module.exports.Index=async(req,res)=>{
    const allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings});
};

module.exports.renderNewForm=(req,res)=>{
    res.render("listings/new.ejs");
    
}

module.exports.createListing=async(req,res)=>{

   let url= req.file.path;
   let filename=req.file.filename;
    let newlisting=new Listing(req.body.listing);
    console.log(newlisting);
    newlisting.owner=req.user._id;
    newlisting.image={url,filename};
   await newlisting.save();
   req.flash("success","New Listing created!");
   res.redirect("/listings");
 
}

module.exports.showListing=async(req,res)=>{
    let {id}=req.params;
    const data=await Listing.findById(id).populate({path:"reviews",populate:{
        path:"author"
    }}).populate("owner");
    if(!data){
        req.flash("error","Listing you are trying to reach does not exist!");
        res.redirect("/listings");
    }
    else{
        console.log(data);
        res.render("listings/show.ejs",{data});
    }
    
}

module.exports.editListing=async(req,res)=>{
    let {id}=req.params;
    const data=await Listing.findById(id);
    if(!data){
        req.flash("error","Listing you are trying to edit does not exist!");
        res.redirect("/listings");
    }
    else{
        let originalImage=data.image.url;
        originalImage=originalImage.replace('/upload','/upload/h_300,w_250/e_blur:300');
        res.render("listings/edit.ejs",{data,originalImage})
    }
    
}

module.exports.updateListing=async(req,res)=>{
    if(!req.body.listing){
        throw new ExpressError(400,"Requires values");
    }
    let {id}=req.params;
    let newlisting=req.body.listing;
    console.log(newlisting.category);
    let listing=await Listing.findByIdAndUpdate(id,newlisting);

    if(typeof req.file!== "undefined"){
        let url= req.file.path;
        let filename=req.file.filename;
        listing.image={url,filename};
        await listing.save();
    }
   

    req.flash("success","Listing Updated!");
    res.redirect(`/listings/${id}`);
}


module.exports.destroyListing=async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted!");
    res.redirect("/listings");
}