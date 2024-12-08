const mongoose = require('mongoose')
const validator = require('validator')

const userSchema = new mongoose.Schema({
    firstName : {
        type:String,
        required : [true,"First name is required"],
        minLength : [2,"First name should contain atleast 2 letters"],
        maxLength : 50,
        trim : true
    },
    lastName : {
        type:String,
        maxLength : 50,
        trim : true
    },
    emailId : {
        type:String,
        required:[true,"Email id id required"],
        unique : [true,"User already exists with the given email"],
        validate : (email)=>{
            if(!validator.isEmail(email)){
                throw new Error('Invalid email')
            }
        }
    },
    password : {
        type:String,
        required:true,
        validate : (pass)=>{
            if(!validator.isStrongPassword(pass)) throw new Error("Password must be at least 8 characters long and include uppercase, lowercase, numbers, and special characters")
        }
    },
    age : {
        type:Number,
        min : 18
    },
    gender : {
        type:String,
        trim : true,
        enum : {
            values : ["male","female","other"],
            message : "Invalid gender"
        }
    },
    photoUrl : {
        type:String,
        default : "https://www.shutterstock.com/image-vector/vector-design-avatar-dummy-sign-600nw-1290556063.jpg",
        validate : (url)=>{
            if(!validator.isURL(url)) throw new Error("Enter a valid photo url")
        }
    },
    about : {
        type:String,
        default : "This is default about user",
        maxLength : 100,
        trim : true
    },
    skills : {
        type: [String],
        default : [],
        validate : (skills)=>{
            if(skills.length > 10) throw new Error("Skills should not be greator than 10")
        }
    }

},{timestamps : true})



const User = mongoose.model("User",userSchema)

module.exports = {
    User
}