const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { savedRedirectUrl } = require("../middeware.js");
const userController = require("../controllers/user.js");
router.route("/signup")
    .get(userController.renderSignUp)
    .post(wrapAsync(userController.signUp));

router.route("/login")
    .get(userController.renderLogin )
    .post(
    savedRedirectUrl, 
    passport.authenticate("local", 
        {failureRedirect :"/login", 
            failureFlash : true}), 
        userController.login    
    );



router.get("/logout",userController.logOut);

module.exports = router;

