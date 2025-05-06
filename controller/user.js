const User=require("../models/User")

module.exports.signUpForm=(req,res)=>
    {
        res.render("User/SignUp")
    }

module.exports.addUser=async (req,res,next)=>
{
    let {email,username,password}=req.body;

    let user1=new User(
        {
            email:email,
            username:username
        }
    )
  let ans=await  User.register(user1,password);
  req.logIn(ans,(err)=>
{
    if(err){next(err)}
    req.flash("Success","Account created succesfully")
     res.redirect("/properties")
})
  
}

module.exports.loginForm=(req,res)=>
{
    res.render('User/Login')
}

module.exports.loginUser=(req,res)=>
    {
        req.flash("Success","Welcome to the account")
        res.redirect('/properties')
    }

module.exports.logoutUser= async(req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      req.flash("Success", "Logged out successfully");
    req.session.destroy(err=>{if(err) return next(err)})
        res.clearCookie("connect.sid")
      return res.redirect('/properties');
    });
  }