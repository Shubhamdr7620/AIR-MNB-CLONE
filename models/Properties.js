const mongoose=require("mongoose");
const{Schema}=mongoose;

const propSchema=mongoose.Schema(
    {
        title:{type:String},
        description:{type:String},
        image:
        {
            filename:{type:String,default:"listingimage"},
            url:{type:String, default:"https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-…"}
        },
         price:{type:Number},
        location:{type:String},
        country:{type:String},
        reviews:[{type:Schema.Types.ObjectId,
                ref:"reviews"
        }],
        owner:{type:Schema.Types.ObjectId,
            ref:"User"
        }
    }
)

const reviews=require("./Reviews")

propSchema.post("findOneAndDelete",async (property)=>
{
    if(property.reviews.length>0)
    {
       let res= await reviews.deleteMany({_id:{$in:property.reviews}})
       console.log(res)
    }
})

const properties = mongoose.model("properties",propSchema)

module.exports=properties;


