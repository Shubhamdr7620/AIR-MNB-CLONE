const express = require('express')
const app = express()
const mongoose = require("mongoose")
const path = require('path')
const methodOverride = require("method-override")
const ejsMate = require("ejs-mate")
const propRoute=require('./router/properties')
const reviewRoute=require('./router/reviews')
const userRoute=require("./router/user")
const session=require('express-session')
const MongoStore=require("connect-mongo")
const flash=require("connect-flash")
const passport=require('passport')
const localPassport=require("passport-local").Strategy;
const User=require("./models/User")
require('dotenv').config()

const store = MongoStore.create({
    mongoUrl: process.env.MONGO_URL,
    dbName:"airmnb",
    touchAfter:24*3600
  });
app.use(session({
    store,
    // store:MongoStore.create({mongoUrl:process.env.MONGO_URL,
    //                     touchAfter:24*3600, // if any updates occured in session it immediately update in DB. but the until the period pass to touchAfter any changes not happened it will automatically refresh data to update timestap or automatially update
    // }), // now session info is stored at mongo atlas innstead of local storage
    secret:"mysecreatkey",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires: new Date(Date.now()+1*24*60*60*100),// Cookies will expire in one day from current date and time
        maxAge:1*24*60*60*100,
        httpOnly:true
    }
}))
  store.on("connected", () => {
    console.log("Session store connected");
  });
  store.on("error", (err) => {
    console.error("Session store error", err);
  });
  

// store.on("error",()=>{console.log("Error",err)})

app.use(flash()); // always use flash after session

//initializing passport authentication middleware
app.use(passport.initialize())
app.use(passport.session())
passport.use(new localPassport(User.authenticate()))

// it means when user get logged in it will be added in session and after logged user will be removed
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req,res,next)=>
{
    res.locals.successMsg=req.flash("Success"),
    res.locals.errorMsg=req.flash("error")
    res.locals.user=req.user;
    next();
}) 

// setting EJS engine
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride("_method"));

app.engine('ejs', ejsMate)

// Database connection
mongoose.connect(process.env.MONGO_URL,{dbName:"airmnb"})
    .then((res) => { console.log(" Mongo Db conected") })
    .catch((err) => { console.log(err) })

app.use('/properties',propRoute);
app.use('/properties/review',reviewRoute)
app.use('/',userRoute)

//Error Handling Middle Ware
app.use((err,req,res,next)=>
{
    // setting default value for status and message in case if error don't have that fields
    // let{status=500,message="Something went wrong"}=err;
    // res.status(status).send(message);
    console.log(err)
})

// Server Starting
app.listen(3000, () => {
    console.log(" Server started")
})