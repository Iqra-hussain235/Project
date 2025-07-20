const express=require("express");
const router = express.Router();



router.get("/",(req,res)=>{
    res.send("hi i am root");
})
//index user
router.get("/user",(req,res)=>{
    res.send("get for user")
});
//show user
router.get("/:id",(req,res)=>{
    res.send("GET for show users");
})
//post
router.post("/",(req,res)=>{
    res.send("POST for users");
})

router.delete("/:id",(req,res)=>{
    res.send("Delete for users id");
})

module.exports = router;