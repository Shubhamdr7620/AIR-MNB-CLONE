const properties = require("../models/Properties")
const reviews=require('../models/Reviews')
const addSchema=require('../Schema Validations/PropertyAddValidation')
const expressError=require('../Error/expressError')
const { cloudinary } = require('../cloudConfig');
const express=require("express")
const app=express()

app.use(express.urlencoded({extended:true}))

//error handling using try-catch block
module.exports.addPropertyForm= (req, res,next) => {
    try{
        if(!req.isAuthenticated())
        {
            req.flash("error","logged in first")
            return res.redirect('/login')
        }
    res.render("Listing/AddProperty"); 
    }
    catch(err)
    {
        next(err);
    }
}

module.exports.addProperty=async (req, res) => {
    let result=addSchema.validate(req.body)
    if(result.error)
    {
        throw new expressError(404,result.error.message);
    }
    let { title, description, image, price, location, country } = req.body;
    let{path,filename}=req.file;
    let p1 = new properties({
        title: title,
        description: description,
        image: { filename: "listing Image", url: image },
        price: price,
        location: location,
        country: country,
        owner:req.user._id,
        image:{url:path,filename:filename}
    })
    await p1.save();
    req.flash("Success","New Property Added Successfully")
    res.redirect("/properties")
}

module.exports.viewProperties=async (req, res) => {
    let data = await properties.find({});
    res.render("Listing/Home", { data })
}

module.exports.viewOneProperty=async (req, res) => {
    let { id } = req.params;
    let data = await properties.findById(id).populate({path:"reviews",populate:{path:"owner"}}).populate("owner");
    let reviewData=await reviews.find({})
    res.render("Listing/ViewProperty", { data })
}

module.exports.findProperty=async(req,res)=>
{
    let {search}=req.query;
    let data=await properties.find({location:search})
    res.render("Listing/Home",{data})
}

module.exports.editForm=async (req, res) => {
    if(!req.isAuthenticated())
        {
            req.flash("error","logged in first")
            return res.redirect('/login')
        }
    let { id } = req.params;
    let data = await properties.findById(id);
    if(!data.owner._id.equals(req.user._id))
    {
        req.flash("error","you don't have access to do it")
       return res.redirect(`/properties/${id}`)
    }
    res.render("Listing/EditProperty", { data })
}


module.exports.editProperty=async (req, res) => {
    let { id } = req.params;
    let data = req.body;
    let{path,filename}=req.file;
    let result=addSchema.validate(data)
    if(result.error)
    {
        req.flash("error",result.error.message)
        throw new expressError(401,result.error.message)
    }
    let a = await properties.findByIdAndUpdate(id, data);
    if(req.file)
    {
      if (a.image && a.image.filename) {
         await cloudinary.uploader.destroy(a.image.filename);
        }

    a.image={url:path,filename:filename}
    await a.save();
    }
    
    req.flash("Success","Property updated sucessfully")
    res.redirect(`/properties/${id}`)
}

module.exports.destroProperty=async (req, res) => {
    if(!req.isAuthenticated())
        {
            req.flash("error","logged in first")
            return res.redirect('/login')
        }
    let { id } = req.params;
    let data = await properties.findById(id);
    if(!data.owner._id.equals(req.user._id))
        {
            req.flash("error","you don't have access to do it")
           return res.redirect(`/properties/${id}`)
        }
    if (data.image && data.image.filename) {
            await cloudinary.uploader.destroy(data.image.filename);
        }
    await properties.findByIdAndDelete(id);
    req.flash("Success","Property deleted sucessfully")
    res.redirect("/properties")
}