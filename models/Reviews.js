const { number } = require("joi")
const mongoose=require("mongoose")
const{Schema}=require('mongoose')

const reviewSchema=mongoose.Schema({
    rating:{type:Number,required:true},
    comment:{type:String,required:true},
    owner:{type:Schema.Types.ObjectId,
        ref:"User"
    }
})

const reviews=mongoose.model("reviews",reviewSchema);

module.exports=reviews;