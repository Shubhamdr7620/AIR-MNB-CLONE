const reviews = require('../models/Reviews');
const properties = require("../models/Properties")

//inserting reviews
module.exports.addReview=async (req,res)=>
    {
        if(!req.isAuthenticated())
        {
            req.flash("error","Logged In First")
           return res.redirect("/login")
        }
        let{id}=req.params;

        let {rating,comments}=req.body;
        const review1= new reviews({
            rating:rating,
            comment:comments,
            owner:req.user._id
        })
        let result= await review1.save()
        
        let prop= await properties.findById(id);
        let res2= await prop.reviews.push(result);
        await prop.save();
        req.flash("Success","Review added successfully")
         res.redirect(`/properties/${id}`)
    }

     //deleting review
module.exports.destroyReview=async(req,res)=>
    {
        if(!req.isAuthenticated())
            {
                req.flash("error","Logged In First")
                res.redirect("/login")
            }

            let{id,rid}=req.params;
            let currReview=await reviews.findById(rid);
            
            if (!currReview.owner._id.equals(req.user._id)) {
                console.log("User ",id)
                console.log("req",req.user._id)
                req.flash("error", "You don't have access to do it");
                return res.redirect(`/properties/${id}`);
            }
        await reviews.findByIdAndDelete(rid);
        req.flash("Success","Review deleted succesfully")
        res.redirect(`/properties/${id}`);
    }