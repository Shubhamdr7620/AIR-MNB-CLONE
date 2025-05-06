const mongoose=require("mongoose")
const PassportLocalMongoose=require("passport-local-mongoose")

let UserSchema=mongoose.Schema(
    {
        email:{type:String,required:true}
    }

    /* since we are using passport-local-mongoose authntication middleware
        then that will automatically add field username, and password,
        and password will salted and hashed using pbkdf2 hashing algorithm
     */
)

UserSchema.plugin(PassportLocalMongoose)

const User=mongoose.model("User",UserSchema)

module.exports=User;