// we are using MVC architecture that's why here we write routes only
//logic behind that routes stored in controller folder

const express=require("express")
const router=express.Router({mergeParams:true});
const asyncWrap=require('../Error/asyncWrap')
const multer=require('multer');
const{storage}=require("../cloudConfig")
const upload=multer({storage})
const propertyController=require('../controller/properties')

//create operations
router.get('/add',propertyController.addPropertyForm)

//from here using asynchWrap function for error handling in asynchronous functions
router.post("/",upload.single("image"),asyncWrap(propertyController.addProperty))

// Read Operation
router.get("/", asyncWrap(propertyController.viewProperties))

//find property
router.get('/search',asyncWrap(propertyController.findProperty))

//Read One Operation
router.get("/:id", asyncWrap(propertyController.viewOneProperty))


// Update Operation
router.get("/:id/edit", asyncWrap(propertyController.editForm))

router.put("/:id/edit", upload.single("image"),asyncWrap(propertyController.editProperty))

// Delete Operation
router.delete('/:id', asyncWrap(propertyController.destroProperty))

module.exports=router;

