const Listing = require("../model/listing");
const ExpressError = require("../utils/ExpressError.js");
const mapKey = process.env.MAP_KEY;
module.exports.index = async (req, res) =>{
    const allListings = await Listing.find();
    res.render("./listings/index.ejs",{allListings});
};

module.exports.renderNewForm = (req,res) =>{    
    res.render("./listings/new.ejs");
}

module.exports.showListing = async(req,res) =>{
    let {id} = req.params;
    const listing = await Listing.findById(id)
    .populate({
        path :"reviews",
        populate : {
            path : "author"
        },
    })
    .populate("owner");
    if(!listing){
        req.flash("error", "Listing you requested for does not exist");
        res.redirect("/listings");
    }
    console.log(listing);
    res.render("./listings/show.ejs",{listing})
}

module.exports.createListing = async(req,res,next)=>{
    // const listing = req.body.listing;
    
    async function geocodePlace(placeName) {
        try {
          const response = await fetch(`https://api.maptiler.com/geocoding/${encodeURIComponent(placeName)}.json?key=${mapKey}`);
          const data = await response.json();
    
          if (data.features.length > 0) {
            const [lng, lat] = data.features[0].geometry.coordinates;
            console.log(`Coordinates of ${placeName}:`, lat, lng);
            return {
                type: "Point",
                coordinates: [lng, lat]
              };
          } else {
            console.log('No results found.');
            return null;
          }
          
        } catch (error) {
          console.error('Geocoding error:', error);
          return null;
        }
      }
    
      // Example usage
      const geometry = await geocodePlace(req.body.listing.location); // ✅ add `await`
      console.log(geometry);
    if (!geometry) {
        req.flash("error", "Could not geocode the location.");
        return res.redirect("/listings/new");
    }
     let url = req.file.path;
     let filename = req.file.filename;
     console.log(url+".."+filename);
     const newListing = new Listing(req.body.listing);
     newListing.owner = req.user._id;
     
     newListing.image = {
        filename: req.file.filename,
        url: req.file.path
      };
      newListing.geometry = geometry;
     console.log(newListing);
     await newListing.save()
     req.flash("success", "New Listing Created");
     // console.log("saved");
     // console.log(newListing);
     res.redirect("/listings")
     };

module.exports.editListing = async(req, res) =>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing you requested for does not exist");
        res.redirect("/listings");
    }
    let originaImageUrl = listing.image.url;
    originaImageUrl = originaImageUrl.replace("/upload", "/upload/w_250");
    res.render("./listings/edit.ejs",{listing, originaImageUrl})
};

module.exports.updateListing = async(req, res) =>{
    
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error", "You don't have permission to edit");
        return res.redirect(`/listings/${id}`);
    }

    let UpdatedListing = await Listing.findByIdAndUpdate(id, {...req.body.listing});
    if(typeof(req.file) != "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        UpdatedListing.image = {
            filename: filename,
            url: url
        };
      await UpdatedListing.save();
    }
    req.flash("success", "Listing Updated");
    res.redirect(`/listings/${id}`);
}

module.exports.deleteListing = async(req,res) =>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted");
    res.redirect("/listings");
};