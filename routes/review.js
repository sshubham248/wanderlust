const express = require("express");
const router = express.Router({mergeParams : true});
const wrapAsync = require("../utils/wrapAsync.js");

const reviewController = require("../controllers/review.js")
const {validatereview, isloggedIn, isReviewAuthor} = require("../middeware.js");

//POST ROUTE

router.post("/",isloggedIn,validatereview, wrapAsync(reviewController.createReview));

//DELETE Route

router.delete("/:reviewid",isloggedIn,isReviewAuthor, wrapAsync(reviewController.destroyReview));

module.exports = router;