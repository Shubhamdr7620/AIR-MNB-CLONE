// we are using MVC architecture that's why here we write routes only
//logic behind that routes stored in controller folder

const express=require('express')
const router=express.Router({mergeParams:true});
const asyncWrap=require('../Error/asyncWrap')
const reviewController = require("../controller/reviews")


router.post("/:id",asyncWrap(reviewController.addReview))

router.delete('/:id/delete/:rid',reviewController.destroyReview)

module.exports=router;