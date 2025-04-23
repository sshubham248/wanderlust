const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {isloggedIn, isOwner,validatelistinig }= require("../middeware.js");
const listingController = require("../controllers/listing.js");
const multer  = require('multer');
const {cloudanary, storage} = require("../claudConfig.js");
const upload = multer({ storage });


router
    .route("/")
    //Index Route
    .get( wrapAsync(listingController.index))
    //create Route
    .post(
        isloggedIn,
        
        upload.single('listing[image][url]'),
        validatelistinig, 
        wrapAsync(listingController.createListing)
    )
    

//New Route
router.get("/new", isloggedIn,listingController.renderNewForm);

router.route("/:id")
//Show Route
    .get(wrapAsync(listingController.showListing))
    //Update Route
    .put(
        isloggedIn,
        isOwner, 
        upload.single('listing[image][url]'),
        validatelistinig, 
        wrapAsync(listingController.updateListing)
    )
    //Delete Route
    .delete(
        isloggedIn,
        isOwner, 
        wrapAsync(listingController.deleteListing)
    );



//Edit Route
router.get("/:id/edit", isloggedIn,isOwner, wrapAsync(listingController.editListing));

module.exports = router;
