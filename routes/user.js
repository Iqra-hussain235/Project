const express=require("express")
const router=express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");
const userController =require("../controllers/users.js");

router.get("/signup",userController.renderSignupForm);


router.post("/signup",wrapAsync (userController.signup));


router.get("/login",userController.renderLoginForm);

router.post("/login",
    saveRedirectUrl,
passport.authenticate("local",{
failureRedirect:'/login',
 failureFlash:true}),
 async(req,res)=>{
    req.flash("success","Welcome to Wanderlust!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
});

router.get("/logout",(req,res)=>{
    req.logout((err)=>{
        if(err){
        return next(err);
        }
        req.flash("success","you are logged out!");
        res.redirect("/listings");
    })

})

module.exports=router;