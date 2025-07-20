const express =require("express");
const app = express();
const user=require("./routes/user.js")
const post=require("./routes/post.js")
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const path=require("path");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const session=require("express-session");

const sessionOptions={
    secret:"mysupersecretstring",
    resave: false, 
    saveUninitialized:true
};
app.use(session(sessionOptions));
app.use(flash());

app.use((req,res,next)=>{
    res.locals.successMsg = req.flash("success");
    res.locals.errorMsg = req.flash("error");
    next();
});

app.get("/register",(req,res)=>{
let {name = "anonymous" }= req.query;
req.session.name=name;

if(name === "anonymous"){

    req.flash("error","user registered not  succefully");
}
else{
    req.flash("success","user registered succefully");

}
res.redirect("/hello");

// console.log(req.session.name);

});

app.get("/hello",(req,res)=>{
    // console.log(req.flash("success"));
    
 res.render("page.ejs",{name: req.session.name});
});

// app.get("/test",(req,res)=>{
//     res.send("test succesfully");
// });

// app.get("/reqcount",(req,res)=>{
//     if(req.session.count){
//         req.session.count++;
//     }
//     else{

//         req.session.count=1;
//     }
//     res.send(`you sent a request ${req.session.count} times`);
// });

app.listen(3000,()=>{
    console.log("server is listing to root")

});
    
    // app.use(cookieParser("secretcode"));
    
    
    // app.get("/getsignedcookie", (req , res)=>{
    //     res.cookie("made-in", "India",{signed:true});
    //     res.send("signed cookie sent");
    // })
    
    
    // app.get("/verify",(req,res)=>{
    //     console.log(req.signedCookies);
    //     res.send("verified");
    // })
    
    
    // app.get("/getcookies",(req,res)=>{
    //     res.cookie("greet","hello");
    //       res.cookie("madein","india");
    //     res.send("sent you cookies!");
    // });
    
    // app.get("/greet",(req,res)=>{
    //     let {name ="anonymous"}=req.cookies;
    //     res.send(`Hi.${name}!`);
    // })
    
    // //post
    
    // app.get("/",(req,res)=>{
    //     console.dir(req.cookies);
    //     res.send("hi i am root");
    // })
    
    // app.use("/users",user);
    // app.use("/posts",post);