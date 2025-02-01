// Import required modules
const express = require('express')
const app = express();
const cookie_parser = require('cookie-parser')
const jwt = require('jsonwebtoken')
const usermodel = require('./models/usermodel')
const tweetmodel =require('./models/tweetmodel')
const path = require('path');
const { config } = require('dotenv');
const my = "my_secret"

// Configure middleware
app.use(cookie_parser());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine" , "ejs");

// Middleware to verify JWT token
const verifytoken = (req , res , next)=>{
const token = req.cookies.auth_token;
if(!token){
   return res.redirect("/login")
}
jwt.verify(token , my,(err , decoded)=>{
    if(err){
       return res.redirect("/login")
    }
    req.user = decoded
    next()
})
}

// Routes for page rendering
app.get("/", (req , res)=>{
    res.render("register")
})
app.get("/register", (req , res)=>{
res.render("register")
})
app.get("/login", (req , res)=>{
res.render("login")
})
app.get("/tweet",verifytoken,async(req,res)=>{
   res.render("tweets")
})
app.get("/tweets",verifytoken,async(req,res)=>{
    try {
        const tweets = await tweetmodel.find().sort({ createdAt: -1 });
        res.json(tweets);
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch tweets' });
      }
})

app.get("/calendar" , verifytoken,(req , res)=>{
    res.render("calender")
})
// Logout route - clears auth cookie
app.get("/logout",verifytoken,(req , res )=>{
    res.clearCookie('auth_token', { httpOnly: true, secure: process.env.NODE_ENV === 'production', path: '/' });
    console.log("clear");
    return res.redirect("/login")
})
// Dashboard route - shows user details
app.get("/dashboard",verifytoken, async(req , res )=>{
    const user = req.user.id
    const userDetails = await usermodel.findById(user)
    const username = userDetails.username
    
    res.render("dashboard",{user: username})
})

// User registration endpoint
app.post("/register", async(req , res)=>{
    const {username , email , password} = req.body;
    const isEXIST =  await usermodel.findOne({email});
    if(isEXIST){
    return res.status(200).send("already existing user please login")
    }

    const user = new usermodel({username , email , password})
    await user.save()
    return res.redirect("/login")
})

app.get("/account",verifytoken, async(req , res)=>{
    const user = req.user.id
    const userDetails = await usermodel.findById(user)
    const username = userDetails.username
    const email =userDetails.email
    const tweets = await tweetmodel.find({email: email}).sort({ createdAt: -1 })
    res.render("account",{username,email,tweets})
})

// User login endpoint
app.post("/login", async(req , res)=>{
    const{email , password } = req.body
    const isEXIST = await usermodel.findOne({email})
    const isPASS =  isEXIST.password
    if(!isEXIST){
       return res.status(500).send("not registered please register")
    }
    if(password != isPASS){
       return res.status(500).send("wrong password")
    }

    const token = jwt.sign({id:isEXIST.id},my,{expiresIn:"10m"})
    res.cookie("auth_token", token ,{
        httpOnly:true,
        secure:true,
        strict:true
    })


     return res.redirect("/dashboard")
})

app.post("/tweets",verifytoken,async(req , res)=>{
    const {tweet}= req.body
    const user = req.user.id
    const userDetails = await usermodel.findById(user)
    const username = userDetails.username
    const email = userDetails.email

    const tweets = new tweetmodel({tweet , username,email})
    await tweets.save()
    return res.redirect("/dashboard")
})


// Start server
app.listen(3000, () => {
    console.log(`Server is running on port ${process.env.PORT}`)
})