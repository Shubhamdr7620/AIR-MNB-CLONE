const joi =require("joi");

let addSchema=joi.object({
    title:joi.string().required(),
    description:joi.string().required(),
    image:joi.string().allow(null).allow('').default("https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-…"),
    price:joi.number().required(),
    location:joi.string().required(),
    country:joi.string().required()
})

module.exports=addSchema;