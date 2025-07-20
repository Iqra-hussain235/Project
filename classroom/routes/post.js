const express=require("express");
const router = express.Router();

//index post
router.get("/",(req,res)=>{
    res.send("get for post")
});
//show post
router.get("/:id",(req,res)=>{
    res.send("GET for show post");
})
//post
router.post("/",(req,res)=>{
    res.send("POST for post");
})

module.exports = router;