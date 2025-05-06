// we are using MVC architecture that's why here we write routes only
//logic behind that routes stored in controller folder

const express=require("express")
const router=express.Router({mergeParams:true})
const passport = require("passport")
const userController=require("../controller/user")


router.get("/signup",userController.signUpForm)

router.post("/signup",userController.addUser)

router.get('/login',userController.loginForm)

router.post('/login',passport.authenticate('local',{failureRedirect:'/login',failureFlash:true}),userController.loginUser)

router.post('/logout', userController.logoutUser);
  

module.exports=router;