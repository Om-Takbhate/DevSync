const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    firstName : {
        type:String,
        required : true,
        minLength : 3,
        maxLength : 50
    },
    lastName : {
        type:String,
        maxLength : 50
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
        type:Number,
        min : 18
    },
    gender : {
        type:String,
        trim : true,
        validate : (value)=>{
            if(!(["male","female","other"].includes(value))){
                throw new Error("Gender value is not valid")
            }
        }
    },
    photoUrl : {
        type:String,
        default : "https://www.shutterstock.com/image-vector/vector-design-avatar-dummy-sign-600nw-1290556063.jpg"
    },
    about : {
        type:String,
        default : "This is default about user",
        trim : true
    },
    skills : {
        type: [String],
        default : []
    }

},{timestamps : true})



const User = mongoose.model("User",userSchema)

module.exports = {
    User
}