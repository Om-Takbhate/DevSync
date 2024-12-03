const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    firstName : {
        type:String,
        required : true,
        lowercase : true
    },
    lastName : {
        type:String
    },
    emailId : {
        type:String,
        required:true,
        unique : true
    },
    password : {
        type:String,
        required:true
    },
    age : {
        type:Number
    },
    gender : {
        type:String,
    },
    photoUrl : {
        type:String,
        default : "https://www.shutterstock.com/image-vector/vector-design-avatar-dummy-sign-600nw-1290556063.jpg"
    },
    about : {
        type:String,
        default : "This is default about user"
    },
    skills : {
        type: [String]
    }

})



const User = mongoose.model("User",userSchema)

module.exports = {
    User
}